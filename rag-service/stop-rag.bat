@echo off
echo Forcefully terminating any running Python RAG-service processes...
taskkill /F /IM python.exe /T 2>NUL
echo Done! All RAG services stopped.
