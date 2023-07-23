import subprocess

from config import settings


class CommandResult:
    """Represents the result of a command execution."""

    def __init__(self, code: int, output: str, err: str):
        self.code = code
        self.output = output
        self.err = err
        self.successful = (code < 1)


class Command:
    """
    Represents an interface to interact with a binary, executable file.
    """
    binary_path = ''

    def __init__(self, cmd):
        if self.binary_path:
            cmd = f'{self.binary_path} {cmd}'
        self.cmd = cmd

    def run(self, as_root: bool = False) -> CommandResult:
        """
        Execute the command and return information about the execution.
        :param as_root: Run the command as root (using sudo)
        :return: A CommandResult object containing information about how the execution went.
        """
        cmd = self.cmd

        if as_root:
            cmd = f"sudo {cmd}"
        proc = subprocess.run(cmd, shell=True, check=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        result = CommandResult(
            proc.returncode,
            proc.stdout.decode('utf-8').strip(),
            proc.stderr.decode('utf-8').strip()
        )
        return result

    def run_as_root(self) -> CommandResult:
        return self.run(True)


class WgQuickCommand(Command):
    binary_path = settings.WG_QUICK_BIN
