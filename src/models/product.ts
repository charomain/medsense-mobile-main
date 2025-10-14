export type ToothcaseProductLabel = {
  name: string;
  price: string;
};

export type ToothcaseProduct = {
  id: string;
  code: string;
  labels: ToothcaseProductLabel;
  thumbUrl: string | null;
  linkUrl: string;
};
