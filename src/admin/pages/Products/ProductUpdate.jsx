import React from "react";
import { useParams } from "react-router-dom";
import ProductFormContainer from "./ProductFormContainer";

function ProductUpdate() {
  const { id } = useParams();
  return <ProductFormContainer productId={id} />;
}

export default ProductUpdate;
