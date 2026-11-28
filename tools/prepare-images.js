// Prepares photos for upload to the website (Pages CMS).
// Runs from the Finder Quick Action "Prepare for website" (see REDESIGN.md),
// or in Terminal:
//   osascript -l JavaScript tools/prepare-images.js photo1.jpg photo2.jpg …
//
// Asks for a project name, then saves a copy of each photo:
// - long edge 2000px (smaller photos are not enlarged), turned upright,
// - JPG at quality 85,
// - without metadata (camera data and GPS location are removed),
// - named project-01.jpg, project-02.jpg… (in file name order),
// all into one folder, Pictures/Website. Preparing more photos for the
// same project later continues the numbering, so nothing is overwritten.
// The originals are never changed. Uses only what is built into macOS.

ObjC.import("Foundation");
ObjC.import("ImageIO");
ObjC.import("CoreGraphics");

const LONG_EDGE = 2000;
const JPG_QUALITY = 0.85;
const OUTPUT_FOLDER = `${ObjC.unwrap($.NSHomeDirectory())}/Pictures/Website`;

function run(paths) {
  const app = Application.currentApplication();
  app.includeStandardAdditions = true;

  const photos = paths.filter(isImage).sort((a, b) => a.localeCompare(b));
  if (!photos.length) {
    app.displayAlert("No photos selected", { message: "Select JPG, PNG, HEIC or TIFF files." });
    return;
  }

  const name = askProjectName(app, photos.length);
  if (!name) return;

  createFolder(OUTPUT_FOLDER);
  const first = highestNumber(OUTPUT_FOLDER, name) + 1;
  photos.forEach((photo, i) => {
    const number = String(first + i).padStart(2, "0");
    saveForWebsite(photo, `${OUTPUT_FOLDER}/${name}-${number}.jpg`);
  });

  app.doShellScript(`open ${quoted(OUTPUT_FOLDER)}`);
  app.displayNotification(`${photos.length} photos added to Pictures/Website`, {
    withTitle: "Ready for the website",
  });
}

function askProjectName(app, count) {
  try {
    const answer = app.displayDialog(`Project name for ${count} photo${count > 1 ? "s" : ""}:`, {
      defaultAnswer: "",
      buttons: ["Cancel", "Prepare"],
      defaultButton: "Prepare",
      withTitle: "Prepare for website",
    });
    return slugify(answer.textReturned) || null;
  } catch (cancelled) {
    return null;
  }
}

function saveForWebsite(input, output) {
  const source = $.CGImageSourceCreateWithURL($.NSURL.fileURLWithPath(input), null);
  const properties = ObjC.castRefToObject($.CGImageSourceCopyPropertiesAtIndex(source, 0, null));
  const width = ObjC.unwrap(properties.objectForKey("PixelWidth"));
  const height = ObjC.unwrap(properties.objectForKey("PixelHeight"));

  // A "thumbnail" in ImageIO terms: the photo scaled down, upright, and
  // without the original's metadata.
  const image = $.CGImageSourceCreateThumbnailAtIndex(
    source,
    0,
    $({
      kCGImageSourceCreateThumbnailFromImageAlways: true,
      kCGImageSourceCreateThumbnailWithTransform: true,
      kCGImageSourceThumbnailMaxPixelSize: Math.min(LONG_EDGE, Math.max(width, height)),
    }),
  );

  const destination = $.CGImageDestinationCreateWithURL(
    $.NSURL.fileURLWithPath(output),
    $("public.jpeg"),
    1,
    null,
  );
  $.CGImageDestinationAddImage(destination, image, $({ kCGImageDestinationLossyCompressionQuality: JPG_QUALITY }));
  if (!$.CGImageDestinationFinalize(destination)) {
    throw new Error(`Could not save ${output}`);
  }
}

function isImage(path) {
  return /\.(jpe?g|png|heic|tiff?)$/i.test(path);
}

function createFolder(folder) {
  $.NSFileManager.defaultManager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(folder, true, $(), null);
}

// The highest number already used for this project in the folder (0 if none).
function highestNumber(folder, name) {
  const files = ObjC.deepUnwrap($.NSFileManager.defaultManager.contentsOfDirectoryAtPathError(folder, null)) || [];
  const pattern = new RegExp(`^${name}-(\\d+)\\.jpg$`);
  return files.reduce((highest, file) => {
    const match = file.match(pattern);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
}

// Same rule as the website's web addresses: "White Suit" → "white-suit".
function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function quoted(path) {
  return `'${path.replace(/'/g, `'\\''`)}'`;
}
