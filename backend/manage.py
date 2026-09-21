#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def _configure_weasyprint_macos_libs():
    """On macOS, WeasyPrint's Pango/gobject libs live under Homebrew's prefix,
    but dyld won't find them unless DYLD_FALLBACK_LIBRARY_PATH points there —
    without this, importing engineer.api (which imports weasyprint) crashes
    the whole server at startup with 'cannot load library libgobject-2.0-0'.
    Must run before any Django app import, so it belongs here, not in .env."""
    if sys.platform != "darwin":
        return
    for prefix in ("/opt/homebrew/lib", "/usr/local/lib"):
        if os.path.isdir(prefix):
            existing = os.environ.get("DYLD_FALLBACK_LIBRARY_PATH", "")
            if prefix not in existing.split(":"):
                os.environ["DYLD_FALLBACK_LIBRARY_PATH"] = (
                    f"{prefix}:{existing}" if existing else prefix
                )
            break


def main():
    """Run administrative tasks."""
    _configure_weasyprint_macos_libs()
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
