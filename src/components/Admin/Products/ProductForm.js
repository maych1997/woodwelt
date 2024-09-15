import {
  Alert,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
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
const ProductForm = () => {
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [productType, setProductType] = useState({value:0,label:'Simple Product'});
  const [taxStatus, setTaxStatus] = useState({value:0,label:'Taxable'});
  const [taxClass, setTaxClass] = useState({value:0,label:'VAT 19%'});
  const [checkedState, setCheckedState] = useState({});
  const productDetails = useSelector((state) => state.store);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const handleProductType = (event) => {
    setProductType({value:event.target.value,label:productDetails.productType.ProducType[event.target.value]});
  };
  useFetchProductDetails();
  useEffect(() => {
    setIsLayoutReady(true);
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
  const [stockStatus, setStockStatus] = useState({value:0,label:'In Stock'});
  // Handler function for radio button changes
  const handleStockStatus = (index) => {
    setStockStatus({value:index,label:productDetails.productType.StockStatus[index]}); // Update state with the selected value
  };
  const handleTaxStatus = (event) => {
    setTaxStatus({value:event.target.value,label:productDetails.productType.TaxStatus[event.target.value]});
  };
  const handleClassSelection = (event) => {
    setTaxClass({value:event.target.value,label:productDetails.productType.TaxClass});
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);
  const [sku,setSku]=useState();
  const [productName,setProductName]=useState();
  const [qty,setQty]=useState(0);
  const [description,setDescription]=useState();
  const [shortDescription,setShortDescription]=useState();
  const [videoUrl,setVideoUrl]=useState();
  const [regularPrice,setRegularPrice]=useState();
  const [salePrice,setSalePrice]=useState();

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
        // Update the database with all image URLs
        // return update(dbRef(database, 'products/'), {
        //   images: uploadedUrls,
        // });
      })
      .then(() => {
        console.log("All images uploaded and database updated successfully!");
        setUploadProgress({});
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        setError("Upload failed");
      });
  };
 const publishProduct=async ()=>{
    try{
      const productRef = dbRef(database, "products/"+sku.toLowerCase().replace(/\s+/g, "_"));
      // Check if the user data already exists
      await set(productRef, {
        sku:sku.toLowerCase().replace(/\s+/g, "_"),
        productName:productName,
        description:description,
        shortDescription:shortDescription,
        videoUrl:videoUrl,
        image: url,
        galleryImage:urls,
        stockStatus:stockStatus.label,
        productForm:checkedState,
        productType:productType.label,
        taxStatus:taxStatus.label,
        taxClass:taxClass.label,
        salePrice:salePrice,
        regularPrice:regularPrice,
        qty:qty,
      });
      alert('Product '+productName+'with sku '+sku.toLowerCase().replace(/\s+/g, "_")+' added successfully');
    }catch(error){
      alert(error);
    }
 }
  return (
    <div className="productContainer">
      <div className="main-title">
        <h3>Add Product</h3>
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
            onChange={(event)=>{setSku(event.target.value)}}
          />
          <TextField
            className="text-input"
            id="product_name"
            size="small"
            label="Product Name"
            variant="outlined"
            type="text"
            onChange={(event)=>{setProductName(event.target.value)}}
          />
          <TextField
            className="text-input"
            id="product_name"
            size="small"
            label="Quantity"
            variant="outlined"
            type="text"
            onChange={(event)=>{setQty(event.target.value)}}
          />
          <div className="headingContainer">
            <h5>Product Description</h5>
          </div>
          <div ref={editorRef}>
            {isLayoutReady && (
              <CKEditor onChange={ ( event, editor ) => {
                const data = editor.getData();
                setDescription(data);
            } } editor={ClassicEditor} config={editorConfig} />
            )}
          </div>
          <div className="headingContainer">
            <h5>Short Description</h5>
          </div>
          <div ref={editorRef}>
            {isLayoutReady && (
              <CKEditor onChange={ ( event, editor ) => {
                const data = editor.getData();
                setShortDescription(data);
            } } editor={ClassicEditor} config={editorConfig} />
            )}
          </div>
          <TextField
            className="text-input"
            id="product_video_url"
            size="small"
            label="Product Video URL"
            variant="outlined"
            type="text"
            onChange={(event)=>{
              setVideoUrl(event.target.value);
            }}
          />
          <div className="headingContainer">
            <h5>Upload Image</h5>
          </div>
          <div className="image_upload_container">
           {url.length!=0? <img
              className="product_image"
              src={url != null || url != undefined || url != "" ? url : ""}
            ></img>:''}
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
            {urls.length > 0
              ? urls.map((url, index) => {
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
            onChange={(event)=>{setRegularPrice(event.target.value)}}
          />
           <div className="headingContainer">
            <h5>Shipping Detail(s)</h5>
          </div>
          <TextField
            className="text-input"
            id="sales_price"
            size="small"
            label="Sales Price"
            variant="outlined"
            type="text"
            onChange={(event)=>{setSalePrice(event.target.value)}}
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
            onChange={(event)=>{setSalePrice(event.target.value)}}
          />
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
            value={productType.value}
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
                <button className="add-product-button" onClick={()=>{publishProduct()}}>Publish</button>
                <button className="add-product-button" onClick={()=>{}}>Cancel</button>
              </div>
        </div>
      </div>
    </div>
  );
};
export default ProductForm;
