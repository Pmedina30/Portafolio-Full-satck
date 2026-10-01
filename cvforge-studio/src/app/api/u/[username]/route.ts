// src/app/api/u/[username]/route.ts
// Endpoint público protegido con enmascaramiento estricto de PII
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sanitizeResumeData, maskPII } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const slug = username.toLowerCase();

    // Consultar currículum publicado
    const { data: resume, error } = await supabaseAdmin
      .from('resumes')
      .select('id, title, slug, template, content, privacy_settings, has_watermark, views_count, updated_at')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !resume) {
      return NextResponse.json(
        { error: 'Currículum no encontrado o no publicado' },
        { status: 404 }
      );
    }

    // Incrementar contador de visitas de forma segura
    await supabaseAdmin
      .from('resumes')
      .update({ views_count: (resume.views_count || 0) + 1 })
      .eq('id', resume.id);

    // Enmascaramiento PII estricto
    const cleanContent = sanitizeResumeData(resume.content);
    const maskedDetails = maskPII(cleanContent.personalDetails, resume.privacy_settings);
    cleanContent.personalDetails = maskedDetails;

    return NextResponse.json({
      success: true,
      resume: {
        id: resume.id,
        title: resume.title,
        slug: resume.slug,
        template: resume.template,
        content: cleanContent,
        hasWatermark: resume.has_watermark,
        viewsCount: (resume.views_count || 0) + 1,
        updatedAt: resume.updated_at,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error al obtener currículum' },
      { status: 500 }
    );
  }
}
