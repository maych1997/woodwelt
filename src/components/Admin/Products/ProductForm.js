import {
  Box,
  Checkbox,
  Chip,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import "ckeditor5/ckeditor5.css";
import { useSelector } from "react-redux";
import useFetchProductDetails from "../../../backend/firebase/System/Product/Details/FetchProductDetails";
import { database, storage } from "../../../backend/firebase/connection";
import { get, set, update } from "firebase/database";
import { ref as dbRef } from "firebase/database";
import { Button } from "react-bootstrap";
import useFetchProductAttributes from "../../../backend/firebase/System/Product/Attributes/FetchProductAttributes";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const colors = [];

const sizes = [];

const multiColors = [];

function getColorStyles(name, personName, theme) {
  return {
    fontWeight: personName?.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

function getSizeStyles(name, personName, theme) {
  return {
    fontWeight: personName?.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

function getMultiColorStyles(name, personName, theme) {
  return {
    fontWeight: personName?.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const ProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [productType, setProductType] = useState({
    value: 0,
    label: "Simple Product",
  });
  const [taxStatus, setTaxStatus] = useState({ value: 0, label: "Taxable" });
  const [taxClass, setTaxClass] = useState({ value: 0, label: "Standard" });
  const [checkedState, setCheckedState] = useState({});
  const [categoryCheckedState, setCategoryCheckedState] = useState({});
  const productDetails = useSelector((state) => state.store);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [attribute, setAttribute] = useState([]);
  const [productAttributeSize, setProductAttributeSize] = useState();
  const [productAttributeColor, setProductAttributeColor] = useState();
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const theme = useTheme();
  const [multiColorArray, setMultiColorArray] = React.useState([]);
  const [colorArray, setColorArray] = React.useState([]);
  const [sizeArray, setSizeArray] = React.useState([]);
  const [color, setColor] = React.useState("null");
  const [size, setSize] = React.useState("null");
  const [uploadProgress, setUploadProgress] = useState({});
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);
  const [sku, setSku] = useState();
  const [productName, setProductName] = useState();
  const [qty, setQty] = useState("0");
  const [description, setDescription] = useState();
  const [shortDescription, setShortDescription] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const [regularPrice, setRegularPrice] = useState();
  const [salePrice, setSalePrice] = useState(0);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [simpleProductWeight, setSimpleProductWeight] = useState("");
  const [simpleProductLength, setSimpleProductLength] = useState("");
  const [simpleProductWidth, setSimpleProductWidth] = useState("");
  const [simpleProductHeight, setSimpleProductHeight] = useState("");
  const [multiColor, setMultiColor] = useState("null");
  const [selectedColorIndex, setSelectedColorIndex] = useState();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState();
  const [selectedMultiColorIndex, setSelectedMultiColorIndex] = useState();
  const handleChangeSimpleProduct = (event, attributeObject, attributeName) => {
    const {
      target: { value },
    } = event;
    if (attributeName.toLowerCase() === "button") {
      setSize(
        value !== undefined ? Object.values(attributeObject.terms)[value] : null
      );
      setSelectedSizeIndex(value);
    } else if (attributeName.toLowerCase() === "color") {
      setColor(
        value !== undefined ? Object.values(attributeObject.terms)[value] : null
      );
      setSelectedColorIndex(value);
    } else if (attributeName.toLowerCase() === "multi-color") {
      setMultiColor(
        value !== undefined ? Object.values(attributeObject.terms)[value] : null
      );
	  console.log(Object.values(attributeObject.terms)[value])
      setSelectedMultiColorIndex(value);
    }
  };

  const handleChangeVariableProduct = (event, index, attributeName) => {
    const {
      target: { value },
    } = event;

    if (attributeName.toLowerCase() === "color") {
      setColorArray(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    } else if (attributeName.toLowerCase() === "button") {
      setSizeArray(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    } else if (attributeName.toLowerCase() === "multi-color") {
      setMultiColorArray(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    }
    console.log(colorArray);
  };

  const handleProductType = (event) => {
    setProductType({
      value: event?.target?.value,
      label: productDetails?.productType?.ProductType[event?.target?.value],
    });
  };
  const handleAttributeSelection = (event) => {
    const selectedValue = event?.target?.value;
    setAttribute((prevAttribute) => {
      const updatedAttribute = new Set(prevAttribute);
      updatedAttribute.add(selectedValue);
      return [...updatedAttribute]; // Convert Set back to array
    });
  };
  const handleRemoveAttribute = (index) => {
    if (Array.isArray(attribute)) {
      // Use the index to filter out the item at that index
      const updatedAttributes = attribute?.filter((_, i) => i !== index);
      setAttribute(updatedAttributes);
    } else {
      console.error("attribute is not an array:", attribute);
    }
  };
  const [categories, setCategories] = useState([]);
  const editAction = () => {
    setDescription(location.state.productData?.description);
    setShortDescription(location.state.productData?.shortDescription);
    setSku(location.state.productData?.sku);
    setProductName(location.state.productData?.productName);
    setQty(location.state.productData?.qty);
    setVideoUrl(location.state.productData?.videoUrl);
    setRegularPrice(location.state.productData?.regularPrice);
    setSalePrice(location.state.productData?.salePrice);
    setShippingEnabled(location.state.productData?.shippingEnabled);
    setHeight(location.state.productData?.height);
    setLength(location.state.productData?.length);
    setWeight(location.state.productData?.weight);
    setWidth(location.state.productData?.width);
    setCategoryCheckedState(location.state.productData?.category);
    setCheckedState(location.state.productData?.productForm);
    setTaxStatus(location.state.productData?.taxStatus);
    setTaxClass(location.state.productData?.taxClass);
    setAttribute(location.state.productData?.productAttribute);
    setUrl(location.state.productData?.image ?? null);
    setUrls(location.state?.productData?.galleryImage ?? []);
    setSelectedMultiColorIndex(
      location.state.productData?.selectedMultiColorIndex
    );
    setSelectedColorIndex(location.state.productData?.selectedColorIndex);
    setSelectedSizeIndex(location.state.productData?.selectedSizeIndex);
    setProductType(location.state.productData?.productType);
    setSimpleProductHeight(location.state.productData?.customizedHeight?.height);
    setSimpleProductWeight(location.state.productData?.customizedWeight?.weight);
    setSimpleProductWidth(location.state.productData?.customizedWidth?.width);
    setSimpleProductLength(location.state.productData?.customizedLength?.length);
    if (Array.isArray(location.state.productData?.color)) {
      location.state.productData?.color?.map((item, index) => {
        colorArray[index] = item?.name;
      });
    }else{
		setColor(location.state.productData?.color);
	}
    if (Array.isArray(location.state.productData?.size)) {
      location.state.productData?.size?.map((item, index) => {
        sizeArray[index] = item?.name;
      });
    }else{
		setSize(location.state.productData?.size)
	}
    if (Array.isArray(location.state.productData?.multiColor)) {
      location.state.productData?.multiColor?.map((item, index) => {
        multiColorArray[index] = item?.name;
      });
    }else{
		setMultiColor(location.state.productData?.multiColor);
	}
  };
  useEffect(() => {
    if (location?.state?.location == "Edit") {
      editAction();
    }
    setIsLayoutReady(true);
    const fetchCategories = async () => {
      try {
        const productRef = dbRef(database, "category/");
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const categoryArray = Object.keys(data).map((key, index) => ({
            id: index,
            ...data[key],
          }));
          setCategories(categoryArray);
        } else {
          alert("No data available");
        }
      } catch (error) {
        alert("Error fetching products:", error);
      }
    };
    fetchCategories();
    if (productDetails?.attributeNode != null) {
      Object.values(productDetails?.attributeNode)?.map((item) => {
        if (item?.terms != undefined) {
          if (item?.type.toLowerCase() == "color") {
            Object.values(item?.terms)?.map((item1) => {
              colors?.push({
                name: item1?.name,
                colorCode: item1?.colorCode,
                slug: item1?.slug,
                color: item1?.color,
              });
            });
          } else if (item?.type.toLowerCase() == "button") {
            Object.values(item?.terms)?.map((item2) => {
              sizes?.push({
                name: item2?.name,
                slug: item2?.slug,
                size: item2?.size,
              });
            });
          } else if (item?.type.toLowerCase() == "multi-color") {
            Object.values(item?.terms)?.map((item3) => {
              multiColors?.push({
                name: item3?.name,
                slug: item3?.slug,
                multiColor: item3?.multiColor,
              });
            });
          }
        }
      });
    }
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "mediaEmbed",
        "insertTable",
        "blockQuote",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Autoformat,
      Autosave,
      BlockQuote,
      Bold,
      Essentials,
      Heading,
      Indent,
      IndentBlock,
      Italic,
      Link,
      List,
      ListProperties,
      MediaEmbed,
      Paragraph,
      PasteFromOffice,
      SelectAll,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    initialData: "",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };
  const handleProductForm = (index) => (event) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [index]: event.target.checked,
    }));
  };
  const handleCategorySelect = (index) => (event) => {
    setCategoryCheckedState((prevState) => ({
      ...prevState,
      [index]: event.target.checked,
    }));
  };
  const [stockStatus, setStockStatus] = useState({
    value: 0,
    label: "In Stock",
  });
  // Handler function for radio button changes
  const handleStockStatus = (index) => {
    setStockStatus({
      value: index,
      label: productDetails.productType.StockStatus[index],
    }); // Update state with the selected value
  };
  const handleTaxStatus = (event) => {
    setTaxStatus({
      value: event.target.value,
      label: productDetails.productType.TaxStatus[event.target.value],
    });
  };
  const handleClassSelection = (event) => {
    setTaxClass({
      value: event.target.value,
      label: productDetails.productType.TaxClass,
    });
  };

  const fileInputRef = useRef(null);
  const fileInputRefGallery = useRef(null);
  const handleButtonClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
    // handleUpload();
  };
  const handleUpload = (image) => {
    const imageRef = storageRef(storage, `products/${image?.name}`);
    const uploadTask = uploadBytes(imageRef, image);

    uploadTask
      .then((snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
        return getDownloadURL(imageRef);
      })
      .then((url) => {
        setUrl(url);
        // update(dbRef(database, "products/"), {
        // image: url,
        // });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleImageChange = () => {
    fileInputRefGallery.current.click();
  };

  const handleUploadGallery = (selectedImages) => {
    if (selectedImages.length === 0) {
      setError("No files selected!");
      return;
    }

    const promises = [];
    const progressList = {};
    const uploadedUrls = [];

    Array.from(selectedImages).forEach((file) => {
      const imageRef = storageRef(storage, `products/${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      promises.push(
        new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Track upload progress
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              progressList[file.name] = progress;
              setUploadProgress({ ...progressList });
            },
            (error) => {
              reject(error);
            },
            () => {
              // Get the download URL and resolve the promise
              getDownloadURL(uploadTask.snapshot.ref)
                .then((url) => {
                  uploadedUrls.push(url);
                  resolve(url);
                })
                .catch(reject);
            }
          );
        })
      );
    });

    Promise.all(promises)
      .then(() => {
        setUrls(uploadedUrls);
      })
      .then(() => {
        alert("All images uploaded and database updated successfully!");
        setUploadProgress({});
      })
      .catch((err) => {
        alert("Upload failed:", err);
      });
  };

  const selectedColorCodes = [];
  const selectedColor = [];
  const selectedSizes = [];
  const selectedMultiColor = [];
  const updateProduct = async () => {
    if (productType?.value == 3) {
      colors?.map((color) => {
        colorArray?.map((colorArray, index) => {
          if (colorArray == color?.name) {
            selectedColor[index] = color;
          }
        });
      });
      sizes?.map((size) => {
        sizeArray?.map((sizeArray, index) => {
          if (sizeArray == size?.name) {
            selectedSizes[index] = size;
          }
        });
      });
      multiColors?.map((multiColor) => {
        multiColorArray?.map((multiColorArray, index) => {
          if (multiColorArray == multiColor?.name) {
            selectedMultiColor[index] = multiColor;
          }
        });
      });
      try {
        const productRef = dbRef(
          database,
          "products/" + sku?.toLowerCase()?.replace(/\s+/g, "_")
        );
        // Check if the user data already exists
        const snapshot = await get(productRef);

        await set(productRef, {
          sku: sku?.toLowerCase()?.replace(/\s+/g, "_"),
          productName: productName,
          description: description?.replace(/<[^>]*>?/gm, ""),
          shortDescription: shortDescription?.replace(/<[^>]*>?/gm, ""),
          videoUrl: videoUrl,
          shippingEnabled: shippingEnabled,
          image: url,
          galleryImage: urls,
          stockStatus: stockStatus.label,
          productForm: checkedState,
          productType: productType,
          taxStatus: taxStatus,
          taxClass: taxClass,
          salePrice: salePrice,
          regularPrice: regularPrice,
          weight: weight,
          length: length,
          height: height,
          width: width,
          qty: qty,
          productAttribute: attribute,
          color: selectedColor,
          size: selectedSizes,
          multiColor: selectedMultiColor,
          category: categoryCheckedState,
        });
        alert(
          "Product " +
            productName +
            "with sku " +
            sku?.toLowerCase().replace(/\s+/g, "_") +
            " updated successfully"
        );
      } catch (error) {
        alert(error);
      }
    } else {
      try {
        const productRef = dbRef(
          database,
          "products/" + sku?.toLowerCase()?.replace(/\s+/g, "_")
        );
        // Check if the user data already exists
        await set(productRef, {
          sku: sku?.toLowerCase()?.replace(/\s+/g, "_"),
          productName: productName,
          description: description?.replace(/<[^>]*>?/gm, ""),
          shortDescription: shortDescription?.replace(/<[^>]*>?/gm, ""),
          videoUrl: videoUrl,
          shippingEnabled: shippingEnabled,
          image: url,
          galleryImage: urls,
          stockStatus: stockStatus.label,
          productForm: checkedState,
          productType: productType,
          taxStatus: taxStatus,
          taxClass: taxClass,
          salePrice: salePrice,
          regularPrice: regularPrice,
          weight: weight,
          length: length,
          height: height,
          width: width,
          customizedWeight: { size: size, weight: simpleProductWeight },
          customizedLength: { size: size, length: simpleProductLength },
          customizedWidth: { size: size, width: simpleProductWidth },
          customizedHeight: { size: size, height: simpleProductHeight },
          qty: qty,
          productAttribute: attribute,
          color: color,
          size: size,
          multiColor: multiColor,
          category: categoryCheckedState,
          selectedColorIndex: selectedColorIndex,
          selectedSizeIndex: selectedSizeIndex,
          selectedMultiColorIndex: selectedMultiColorIndex,
        });

        alert(
          "Product " +
            productName +
            "with sku " +
            sku?.toLowerCase()?.replace(/\s+/g, "_") +
            " updated successfully"
        );
      } catch (error) {
        alert(error);
      }
    }
  };
  const publishProduct = async () => {
    if (productType?.value == 3) {
      colors?.map((color) => {
        colorArray?.map((colorArray, index) => {
          if (colorArray == color?.name) {
            selectedColor[index] = color;
          }
        });
      });
      sizes?.map((size) => {
        sizeArray?.map((sizeArray, index) => {
          if (sizeArray == size?.name) {
            selectedSizes[index] = size;
          }
        });
      });
      multiColors?.map((multiColor) => {
        multiColorArray?.map((multiColorArray, index) => {
          if (multiColorArray == multiColor?.name) {
            selectedMultiColor[index] = multiColor;
          }
        });
      });

      try {
        const productRef = dbRef(
          database,
          "products/" + sku?.toLowerCase()?.replace(/\s+/g, "_")
        );
        // Check if the user data already exists
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          alert(
            `Product with SKU ${sku
              ?.toLowerCase()
              .replace(/\s+/g, "_")} already exists.`
          );
          return; // Exit the function if the product exists
        } else {
          await set(productRef, {
            sku: sku?.toLowerCase()?.replace(/\s+/g, "_"),
            productName: productName,
            description: description?.replace(/<[^>]*>?/gm, ""),
            shortDescription: shortDescription?.replace(/<[^>]*>?/gm, ""),
            videoUrl: videoUrl,
            shippingEnabled: shippingEnabled,
            image: url,
            galleryImage: urls,
            stockStatus: stockStatus.label,
            productForm: checkedState,
            productType: productType,
            taxStatus: taxStatus,
            taxClass: taxClass,
            salePrice: salePrice,
            regularPrice: regularPrice,
            weight: weight,
            length: length,
            height: height,
            width: width,
            qty: qty,
            productAttribute: attribute,
            color: selectedColor,
            size: selectedSizes,
            multiColor: selectedMultiColor,
            category: categoryCheckedState,
          });
          alert(
            "Product " +
              productName +
              "with sku " +
              sku?.toLowerCase().replace(/\s+/g, "_") +
              " added successfully"
          );
        }
      } catch (error) {
        alert(error);
      }
    } else {
      try {
        const productRef = dbRef(
          database,
          "products/" + sku?.toLowerCase()?.replace(/\s+/g, "_")
        );
        // Check if the user data already exists
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          alert(
            `Product with SKU ${sku
              ?.toLowerCase()
              ?.replace(/\s+/g, "_")} already exists.`
          );
          return; // Exit the function if the product exists
        } else {
          await set(productRef, {
            sku: sku?.toLowerCase()?.replace(/\s+/g, "_"),
            productName: productName,
            description: description?.replace(/<[^>]*>?/gm, ""),
            shortDescription: shortDescription?.replace(/<[^>]*>?/gm, ""),
            videoUrl: videoUrl,
            image: url,
            shippingEnabled: shippingEnabled,
            galleryImage: urls,
            stockStatus: stockStatus.label,
            productForm: checkedState,
            productType: productType,
            taxStatus: taxStatus,
            taxClass: taxClass,
            salePrice: salePrice,
            regularPrice: regularPrice,
            weight: weight,
            length: length,
            height: height,
            width: width,
            customizedWeight: { size: size, weight: simpleProductWeight },
            customizedLength: { size: size, length: simpleProductLength },
            customizedWidth: { size: size, width: simpleProductWidth },
            customizedHeight: { size: size, height: simpleProductWeight },
            qty: qty,
            productAttribute: attribute,
            color: color,
            size: size,
            multiColor: multiColor,
            category: categoryCheckedState,
            selectedColorIndex: selectedColorIndex,
            selectedSizeIndex: selectedSizeIndex,
            selectedMultiColorIndex: selectedMultiColorIndex,
          });

          alert(
            "Product " +
              productName +
              "with sku " +
              sku?.toLowerCase()?.replace(/\s+/g, "_") +
              " added successfully"
          );
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  useFetchProductAttributes();
  useFetchProductDetails();
  return (
    <div className="productContainer">
      <div className="main-title">
        <h3>
          {location?.state?.location == "Edit" ? "Edit Product" : "Products"}
        </h3>
      </div>
      <div className="sub-container">
        <div className="form-container">
          <TextField
            className="text-input"
            id="sku"
            size="small"
            label="SKU"
            variant="outlined"
            type="text"
            value={sku}
            onChange={(event) => {
              setSku(event.target.value);
            }}
          />
          <TextField
            className="text-input"
            id="product_name"
            size="small"
            label="Product Name"
            variant="outlined"
            type="text"
            value={productName}
            onChange={(event) => {
              setProductName(event.target.value);
            }}
          />
          <TextField
            className="text-input"
            id="product_name"
            size="small"
            label="Quantity"
            variant="outlined"
            type="text"
            value={qty}
            onChange={(event) => {
              setQty(event.target.value);
            }}
          />
          <div className="headingContainer">
            <h5>Set Category</h5>
          </div>
          <div className="category_selection_container">
            {categories?.map((item, index) => (
              <div className="checkBoxContainer" key={index}>
                <p>{item.categoryName}</p>
                <Checkbox
                  checked={!!categoryCheckedState[index]} // Convert undefined to false
                  onChange={handleCategorySelect(index)}
                  size="small"
                />
              </div>
            ))}
          </div>
          <div className="headingContainer">
            <h5>Product Description</h5>
          </div>
          <div ref={editorRef}>
            {isLayoutReady && (
              <CKEditor
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
                editor={ClassicEditor}
                config={editorConfig}
                data={description}
              />
            )}
          </div>
          <div className="headingContainer">
            <h5>Short Description</h5>
          </div>
          <div ref={editorRef}>
            {isLayoutReady && (
              <CKEditor
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setShortDescription(data);
                }}
                data={shortDescription}
                editor={ClassicEditor}
                config={editorConfig}
              />
            )}
          </div>
          <TextField
            className="text-input"
            id="product_video_url"
            size="small"
            label="Product Video URL"
            variant="outlined"
            type="text"
            value={videoUrl}
            onChange={(event) => {
              setVideoUrl(event.target.value);
            }}
          />
          <div className="headingContainer">
            <h5>Upload Image</h5>
          </div>
          <div className="image_upload_container">
            {url.length != 0 ? (
              <img
                className="product_image"
                src={url != null || url != undefined || url != "" ? url : ""}
              ></img>
            ) : (
              ""
            )}
            <Button
              className="plus-button"
              variant="contained"
              onClick={() => {
                handleButtonClick();
              }}
            >
              <p>+</p>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the input element
              onChange={(event) => {
                handleUpload(event.target.files[0]);
              }}
            />
          </div>
          <div className="headingContainer">
            <h5>Upload Gallery Images</h5>
          </div>
          <div className="image_upload_container">
            {urls?.length > 0
              ? urls?.map((url, index) => {
                  return (
                    <img
                      key={index}
                      className="product_image"
                      src={
                        url != null || url != undefined || url != "" ? url : ""
                      }
                    ></img>
                  );
                })
              : ""}

            <Button
              className="plus-button"
              variant="contained"
              onClick={() => {
                handleImageChange();
              }}
            >
              <p>+</p>
            </Button>
            <input
              type="file"
              multiple
              ref={fileInputRefGallery}
              style={{ display: "none" }} // Hide the input element
              onChange={(event) => {
                handleUploadGallery(event.target.files);
              }}
            />
          </div>
          <div className="headingContainer">
            <h5>Regular Price (€)</h5>
          </div>
          <TextField
            className="text-input"
            id="regular_price"
            size="small"
            label="Regular Price"
            variant="outlined"
            type="text"
            value={regularPrice}
            onChange={(event) => {
              setRegularPrice(event.target.value);
            }}
          />
          <div className="headingContainer">
            <h5>Sales Price (€)</h5>
          </div>
          <TextField
            className="text-input"
            id="sales_price"
            size="small"
            label="Sales Price"
            variant="outlined"
            type="text"
            value={salePrice}
            onChange={(event) => {
              setSalePrice(event.target.value);
            }}
          />
          <div className="headingContainer">
            <h5>Shipping Detail(s)</h5>
            <div className="shipping-container">
              <Checkbox
                checked={shippingEnabled} // Convert undefined to false
                onChange={() => {
                  setShippingEnabled(!shippingEnabled);
                }}
                size="small"
              />
              <h6>Enable Shipping</h6>
            </div>
          </div>
          <div
            className="shipping-details"
            style={{ display: shippingEnabled ? "flex" : "none" }}
          >
            <div>
              <div className="headingContainer">
                <h6>Weight</h6>
              </div>
              <TextField
                className="text-input"
                id="weight"
                size="small"
                label="Weight"
                variant="outlined"
                type="text"
                value={weight}
                onChange={(event) => {
                  setWeight(event.target.value);
                }}
              />
            </div>
            <div>
              <div className="headingContainer">
                <h6>Length</h6>
              </div>
              <TextField
                className="text-input"
                id="length"
                size="small"
                label="Length"
                variant="outlined"
                type="text"
                value={length}
                onChange={(event) => {
                  setLength(event.target.value);
                }}
              />
            </div>
            <div>
              <div className="headingContainer">
                <h6>Width</h6>
              </div>
              <TextField
                className="text-input"
                id="width"
                size="small"
                label="Width"
                variant="outlined"
                type="text"
                value={width}
                onChange={(event) => {
                  setWidth(event.target.value);
                }}
              />
            </div>
            <div>
              <div className="headingContainer">
                <h6>Height</h6>
              </div>
              <TextField
                className="text-input"
                id="height"
                size="small"
                label="Height"
                variant="outlined"
                type="text"
                value={height}
                onChange={(event) => {
                  setHeight(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="headingContainer">
            <h5>Product Form</h5>
          </div>
          {productDetails?.productType?.ProductForm?.map((item, index) => (
            <div className="checkBoxContainer" key={index}>
              <p>{item}</p>
              <Checkbox
                checked={!!checkedState[index]} // Convert undefined to false
                onChange={handleProductForm(index)}
                size="small"
              />
            </div>
          ))}
          <div className="headingContainer">
            <h5>Stock Status</h5>
          </div>
          {productDetails?.productType?.StockStatus?.map((item, index) => (
            <div className="checkBoxContainer" key={index}>
              <p>{item}</p>
              <Radio
                checked={stockStatus.value === index} // Check if this radio button is selected based on index
                onChange={() => handleStockStatus(index)} // Update state on change
                value={item} // Optional: value can be used but it's not strictly needed if you only track by index
                name="stock-status" // Name attribute for grouping radio buttons
                inputProps={{ "aria-label": item }} // Accessibility label
              />
            </div>
          ))}
          <div className="headingContainer">
            <h5>Product Type</h5>
          </div>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={productType?.value}
            onChange={(event) => {
              handleProductType(event);
            }}
            size="small"
          >
            {productDetails?.productType?.ProductType?.map((item, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
          <div className="headingContainer">
            <h5>Attributes</h5>
          </div>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={attribute}
            onChange={(event) => {
              handleAttributeSelection(event);
            }}
            size="small"
          >
            {productDetails?.attributeNode != null ||
            productDetails?.attributeNode != undefined ? (
              Object.values(productDetails?.attributeNode)?.map(
                (item, index) => {
                  return (
                    <MenuItem
                      disabled={attribute?.includes(index) ? true : false}
                      key={index}
                      value={index}
                    >
                      {item?.name}
                    </MenuItem>
                  );
                }
              )
            ) : (
              <MenuItem disabled>No attributes available</MenuItem>
            )}
          </Select>
          <div>
            <table className="table">
              <thead>
                {attribute?.length != 0 ? (
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Selection Options</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Length</th>
                    <th scope="col">Width</th>
                    <th scope="col">Height</th>
                    <th scope="col">Action</th>
                  </tr>
                ) : (
                  ""
                )}
              </thead>
              {attribute?.map((item, index) => {
                console.log(
                  Object.values(
                    Object.values(productDetails?.attributeNode)[item].terms
                  )
                );
                if (
                  productDetails?.attributeNode != null ||
                  productDetails?.attributeNode != undefined
                ) {
                  return (
                    <tbody>
                      <tr>
                        <td>
                          {
                            Object.values(productDetails?.attributeNode)[item]
                              ?.name
                          }
                        </td>
                        {productType?.value == 0 ? (
                          <td>
                            {Object.values(productDetails?.attributeNode)[item]
                              ?.terms != undefined ||
                            Object.values(productDetails?.attributeNode)[item]
                              ?.terms != null ? (
                              <Select
                                className="select-attribute"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                value={
                                  Object.values(productDetails?.attributeNode)[
                                    item
                                  ]?.type.toLowerCase() == "color"
                                    ? selectedColorIndex
                                    : Object.values(
                                        productDetails?.attributeNode
                                      )[item]?.type.toLowerCase() == "button"
                                    ? selectedSizeIndex
                                    : Object.values(
                                        productDetails?.attributeNode
                                      )[item]?.type.toLowerCase() ==
                                      "multi-color"
                                    ? selectedMultiColorIndex
                                    : ""
                                }
                                onChange={(event) => {
                                  if (
                                    productDetails?.attributeNode != null ||
                                    productDetails?.attributeNode != undefined
                                  ) {
                                    handleChangeSimpleProduct(
                                      event,
                                      Object.values(
                                        productDetails?.attributeNode
                                      )[item],
                                      Object.values(
                                        productDetails?.attributeNode
                                      )[item]?.type
                                    );
                                  }
                                }}
                              >
                                {Object.values(
                                  Object.values(productDetails?.attributeNode)[
                                    item
                                  ]?.terms
                                )?.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={index}>
                                      {item?.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            ) : (
                              <button
                                onClick={() => {
                                  navigate(
                                    "/admin/dashboard?location=attributes"
                                  );
                                }}
                              >
                                Configure Terms
                              </button>
                            )}
                          </td>
                        ) : (
                          <td>
                            <Select
                              labelId="demo-multiple-chip-label"
                              id="demo-multiple-chip"
                              multiple
                              value={
                                Object.values(productDetails?.attributeNode)[
                                  item
                                ]?.type.toLowerCase() == "color"
                                  ? colorArray
                                  : Object.values(
                                      productDetails?.attributeNode
                                    )[item]?.type.toLowerCase() == "button"
                                  ? sizeArray
                                  : Object.values(
                                      productDetails?.attributeNode
                                    )[item]?.type.toLowerCase() == "multi-color"
                                  ? multiColorArray
                                  : ""
                              }
                              onChange={(event) => {
                                handleChangeVariableProduct(
                                  event,
                                  index,
                                  Object.values(productDetails?.attributeNode)[
                                    item
                                  ]?.type
                                );
                              }}
                              input={
                                <OutlinedInput
                                  id="select-multiple-chip"
                                  label="Chip"
                                />
                              }
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected?.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {Object.values(
                                Object.values(productDetails?.attributeNode)[
                                  item
                                ]?.terms
                              )?.map((item, index) => {
                                return (
                                  <MenuItem
                                    style={
                                      Object.values(
                                        productDetails?.attributeNode
                                      )[index]?.type.toLowerCase() == "color"
                                        ? getColorStyles(
                                            item?.name,
                                            colorArray,
                                            theme
                                          )
                                        : Object.values(
                                            productDetails?.attributeNode
                                          )[index]?.type.toLowerCase() ==
                                          "button"
                                        ? getSizeStyles(
                                            item?.name,
                                            sizeArray,
                                            theme
                                          )
                                        : Object.values(
                                            productDetails?.attributeNode
                                          )[index]?.type.toLowerCase() ==
                                          "multi-color"
                                        ? getMultiColorStyles(
                                            item?.name,
                                            multiColorArray,
                                            theme
                                          )
                                        : null
                                    }
                                    key={index}
                                    value={item?.name}
                                  >
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </td>
                        )}
                        {Object.values(productDetails?.attributeNode)[
                          item
                        ]?.type.toLowerCase() == "button" ? (
                          <>
                            <td>
                              <TextField
                                className="text-input-custom"
                                id="simpleProductWeight"
                                size="small"
                                variant="outlined"
                                type="text"
                                value={simpleProductWeight}
                                onChange={(event) => {
                                  setSimpleProductWeight(event.target.value);
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                className="text-input-custom"
                                id="simpleProductLength"
                                size="small"
                                variant="outlined"
                                type="text"
                                value={simpleProductLength}
                                onChange={(event) => {
                                  setSimpleProductLength(event.target.value);
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                className="text-input-custom"
                                id="simpleProductWidth"
                                size="small"
                                variant="outlined"
                                type="text"
                                value={simpleProductWidth}
                                onChange={(event) => {
                                  setSimpleProductWidth(event.target.value);
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                className="text-input-custom"
                                id="simpleProductHeight"
                                size="small"
                                variant="outlined"
                                type="text"
                                value={simpleProductHeight}
                                onChange={(event) => {
                                  setSimpleProductHeight(event.target.value);
                                }}
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </>
                        )}
                        <td className="remove">
                          <button
                            onClick={() => {
                              handleRemoveAttribute(index);
                              setProductAttributeSize(null);
                              setProductAttributeColor(null);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  );
                }
              })}
            </table>
          </div>
          <div className="headingContainer">
            <h5>Tax Status</h5>
          </div>
          {productType != 1 ? (
            <div className="fields-container">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={taxStatus.value}
                onChange={(event) => {
                  handleTaxStatus(event);
                }}
                size="small"
              >
                {productDetails?.productType?.TaxStatus?.map((item, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
              <div className="headingContainer">
                <h5>Tax Class</h5>
              </div>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={taxClass.value}
                onChange={(event) => {
                  handleClassSelection(event);
                }}
                size="small"
              >
                {productDetails?.productType?.TaxClass?.map((item, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          ) : (
            ""
          )}
          <div className="buttonContainer">
            {location?.state?.location == "Edit" ? (
              <button
                className="add-product-button"
                onClick={() => {
                  updateProduct();
                }}
              >
                Update
              </button>
            ) : (
              <button
                className="add-product-button"
                onClick={() => {
                  publishProduct();
                }}
              >
                Publish
              </button>
            )}

            <button
              className="add-product-button"
              onClick={() => {
                navigate("/admin/dashboard?location=products");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductForm;
