export const removeFileExtension = (fileName: string): string => {
  const fileArray = fileName.split('.')
  fileArray.pop()
  return fileArray.join('.')
}
