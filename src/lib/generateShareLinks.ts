interface ShareDetails {
  url: string;
  title: string;
  tags?: string[];
}

const encode = encodeURIComponent;

export function socialWindow(url: string): void {
  const width = 600;
  const height = 400;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;

  window.open(
    url,
    "_blank",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
  );
}

export function generateShareLinks(details: ShareDetails) {
  const encodedUrl = encode(details.url);
  const encodedTitle = encode(details.title);
  const encodedHashtags = details.tags
    ? encode(
        details.tags
          .filter((tag) => tag !== "Uncategorized")
          .map((tag) => tag.replace(/\s+/g, ""))
          .join(",")
      )
    : "";

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${details.tags ? `&hashtags=${encodedHashtags}` : ""}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
}
