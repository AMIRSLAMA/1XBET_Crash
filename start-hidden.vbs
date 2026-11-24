
Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

projectFolder = FSO.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = projectFolder

command = "cmd.exe /c node monitor.js"
WshShell.Run command, 0, False
