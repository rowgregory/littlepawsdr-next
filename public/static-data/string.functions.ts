export const isStringInPath = (path: string, searchString: string) => {
  return path.includes(searchString);
};

export const shouldExcludePath = (pathname: any) => {
  const validPaths = ["/"];

  const isValidPath = validPaths.some((path) => pathname === path);

  // If the current pathname is invalid (not in the valid paths), exclude header and footer
  return !isValidPath;
};
