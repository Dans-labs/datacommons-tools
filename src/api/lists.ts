export const fetchExtensions = async (): Promise<string[]> => {
  const res = await fetch(
    "https://gist.githubusercontent.com/Eseperio/6e40a66b25f5404bab40d87a55012e67/raw/39b5467170aabe75eee2fb232105a61a3f520062/all-file-extensions.json"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch extensions");
  }

  const data = await res.json();

  return Object.keys(data);
};

export const fetchLicenses = async (): Promise<string[]> => {
  const res = await fetch(
    "https://licenses.opendefinition.org/licenses/groups/all.json"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch licenses");
  }

  const data = await res.json();

  return Object.keys(data);
};
