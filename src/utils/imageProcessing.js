import * as ImageManipulator from 'expo-image-manipulator';

export async function imageAssetToDataUrl(asset, options) {
  const { maxWidth, compress } = options;

  const manipResult = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: maxWidth } }],
    {
      compress,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    }
  );

  if (!manipResult.base64) {
    throw new Error('Failed to generate base64 output for the image.');
  }

  return `data:image/jpeg;base64,${manipResult.base64}`;
}
