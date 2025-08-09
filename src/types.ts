export type Site = {
  title: string;
  description: string;
  email: string;
};

export type Heading = {
  depth: number;
  slug: string;
  text: string;
};

export type TOCHeading = Heading & {
  subheadings: TOCHeading[];
};
