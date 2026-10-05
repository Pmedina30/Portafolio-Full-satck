// src/app/api/resumes/save/route.ts
// API Route para validación segura (Zod-compatible) y persistencia blindada en Supabase
import { NextRequest, NextResponse } from 'next/server';
import { ResumeDataSchema, sanitizeResumeData } from '@/lib/validation';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado: Token de sesión ausente' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // 1. Verificación criptográfica del JWT con el motor de Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sesión inválida o expirada' },
        { status: 401 }
      );
    }

    // 2. Parseo y sanitización estricta anti-XSS con Zod Schema
    const body = await req.json();
    const validation = ResumeDataSchema.safeParse(body.content);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validación de esquema fallida',
          issues: validation.error?.issues.map((i: any) => i.message),
        },
        { status: 400 }
      );
    }

    const cleanData = validation.data!;
    const slug = (body.slug || cleanData.personalDetails.fullName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) || 'mi-cv';
    const title = body.title || cleanData.personalDetails.headline || 'Curriculum Vitae';
    const templateId = body.template || 'cupertino_minimal';

    // 3. Inserción / Actualización con aislamiento multi-inquilino (user_id = user.id)
    const { data: row, error: dbError } = await supabaseAdmin
      .from('resumes')
      .upsert(
        {
          user_id: user.id,
          slug,
          title,
          template: templateId,
          content: cleanData,
          privacy_settings: cleanData.privacySettings || {},
          industry: cleanData.industry || 'tech_software',
          is_published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,slug' }
      )
      .select()
      .single();

    if (dbError) {
      console.error('[API_RESUME_SAVE_ERROR]:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Currículum validado, sanitizado y guardado con éxito',
      resumeId: row.id,
      slug: row.slug,
    });
  } catch (error: any) {
    console.error('[API_RESUME_SAVE_CRITICAL]:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
