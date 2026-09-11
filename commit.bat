@echo off
set GIT=C:\Users\pmedina\AppData\Local\Programs\Git\cmd\git.exe
%GIT% add .
%GIT% -c user.email=portfolio@pmedina.dev -c user.name=pmedina commit -m "feat(colmado-app): add ColmadoPro POS, Inventory and Dashboard full-stack app"
echo Commit exit code: %ERRORLEVEL%
