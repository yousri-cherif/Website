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
// into a new folder "project for website" next to the originals.
// The originals are never changed. Uses only what is built into macOS.

ObjC.import("Foundation");
ObjC.import("ImageIO");
ObjC.import("CoreGraphics");

const LONG_EDGE = 2000;
const JPG_QUALITY = 0.85;

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

  const folder = createOutputFolder(parentFolder(photos[0]), name);
  photos.forEach((photo, i) => {
    const number = String(i + 1).padStart(2, "0");
    saveForWebsite(photo, `${folder}/${name}-${number}.jpg`);
  });

  app.doShellScript(`open ${quoted(folder)}`);
  app.displayNotification(`${photos.length} photos in "${lastPart(folder)}"`, {
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

function createOutputFolder(parent, name) {
  const manager = $.NSFileManager.defaultManager;
  let folder = `${parent}/${name} for website`;
  for (let n = 2; manager.fileExistsAtPath(folder); n++) {
    folder = `${parent}/${name} for website ${n}`;
  }
  manager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(folder, false, $(), null);
  return folder;
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

function parentFolder(path) {
  return path.slice(0, path.lastIndexOf("/"));
}

function lastPart(path) {
  return path.slice(path.lastIndexOf("/") + 1);
}

function quoted(path) {
  return `'${path.replace(/'/g, `'\\''`)}'`;
}
