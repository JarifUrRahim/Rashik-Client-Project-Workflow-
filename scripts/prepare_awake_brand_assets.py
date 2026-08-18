from pathlib import Path
from PIL import Image

SOURCE = Path("/home/ubuntu/upload/Rashik_org_logo.png")
TARGETS = [
    Path("/home/ubuntu/one-cognitive-mirror/assets/images/icon.png"),
    Path("/home/ubuntu/one-cognitive-mirror/assets/images/splash-icon.png"),
    Path("/home/ubuntu/one-cognitive-mirror/assets/images/favicon.png"),
    Path("/home/ubuntu/one-cognitive-mirror/assets/images/android-icon-foreground.png"),
]
MAX_BYTES = 900_000


def export_checkpoint_safe_logo(image: Image.Image, target: Path) -> None:
    for size in (512, 448, 384, 320, 256):
        candidate = image.copy()
        candidate.thumbnail((size, size), Image.Resampling.LANCZOS)
        candidate.save(target, format="PNG", optimize=True, compress_level=9)
        if target.stat().st_size <= MAX_BYTES:
            return
    raise RuntimeError(f"Could not prepare {target.name} below {MAX_BYTES} bytes")


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source logo: {SOURCE}")
    with Image.open(SOURCE) as raw:
        normalized = raw.convert("RGBA")
        for target in TARGETS:
            target.parent.mkdir(parents=True, exist_ok=True)
            export_checkpoint_safe_logo(normalized, target)
            print(f"{target.name}: {target.stat().st_size} bytes")


if __name__ == "__main__":
    main()
