var Schema = require('simpleschema')
/*eslint-disable*/
export const ProductInformationSchema = new Schema({
    // sr_no: {
    //     type: "number",
    //     label: "sr no",
    //     max: 1090,
    //     optional: true,
    //     allowedValues: [],
    //     defaultValue: '',
    //     maxLength : '',
    //     regEx:''
    // },
    product_id: {
        type: "string",
        label: "Product Id",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    sku: {
        type: "string",
        label: "SKU",
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    country: {
        type: "string",
        label: "Country",
        allowedValues: ['US', 'CA', 'AU'],
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    available_currencies:{
      type: "string",
      label: "Available Currency",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    available_regions:{
      type: "string",
      label: "Available Regions",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    nonavailable_regions:{
      type: "string",
      label: "Non-Available Regions",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    price_1:{
      type: "number",
      label: "Price 1",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    default_color:{
      type: "string",
      label: "Default Color",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    attr_colors:{
      type: "string",
      label: "Attribute Color",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    attr_colors:{
      type: "string",
      label: "Attribute Color",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    attr_imprint_color:{
      type: "string",
      label: "Attribute Imprint Color",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    attr_shape:{
      type: "string",
      label: "Attribute Shape",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    attr_decimal:{
      type: "string",
      label: "Attribute Decimal",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    language: {
        type: "string",
        label: "Language",
        allowedValues: ['en', 'fr'],
        optional: false,
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    currency: {
        type: "string",
        label: "Currency",
        allowedValues: ['USD', 'CAD'],
        optional: false,
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    product_name: {
        type: "string",
        label: "Product Name",
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    description: {
        type: "string",
        label: "Description",
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    linename: {
        type: "string",
        label: "Linename",
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    categories: {
        type: "string",
        label: "Categories",
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    search_keyword: {
        type: "string",
        label: "Search Keyword",
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    default_image: {
        type: "string",
        label: "Default Image",
        optional: false,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    default_image_color_code: {
        type: "string",
        label: "Default Image Color Code",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    valid_up_to: {
        type: "string",
        label: "Valid Up To",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''

    },
    matrix_price: {
        type: "string",
        label: "Matrix Price",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    matrix_frieght: {
        type: "string",
        label: "Matrix Frieght",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    vat: {
        type: "string",
        label: "Vat",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    vat_unit: {
        type: "string",
        label: "vat unit",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    packaging_type: {
        type: "string",
        label: "Packaging Type",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    packaging_charges: {
        type: "string",
        label: "Packaging Charges",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    packaging_code: {
        type: "string",
        label: "Packaging Code",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    video_url: {
        type: "string",
        label: "Video URL",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    distributor_central_url: {
        type: "string",
        label: "Distributor Central URL",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    special_price_valid_up_to: {
        type: "string",
        label: "Special Price Valid Up To",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    // fileID: {
    //     type: "string",
    //     label: "file ID",
    //     optional: true,
    //     allowedValues: [],
    //     defaultValue: '',
    //     maxLength : '',
    //     regEx:''
    // },
    // owner: {
    //     type: "string",
    //     label: "owner",
    //     optional: true,
    //     allowedValues: [],
    //     defaultValue: '',
    //     maxLength : '',
    //     regEx:''
    // },
    // username: {
    //     type: "string",
    //     label: "username",
    //     optional: true,
    //     allowedValues: [],
    //     defaultValue: '',
    //     maxLength : '',
    //     regEx:''
    // },
  feature_1: {
        type: "string",
        label: "feature_1",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_2: {
          type: "string",
          label: "feature_2",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_3: {
        type: "string",
        label: "feature_3",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_4: {
          type: "string",
          label: "feature_4",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_5: {
        type: "string",
        label: "feature_5",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_6: {
          type: "string",
          label: "feature_6",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_7: {
        type: "string",
        label: "feature_7",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_8: {
          type: "string",
          label: "feature_8",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_9: {
        type: "string",
        label: "feature_9",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_10: {
          type: "string",
          label: "feature_10",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_11: {
        type: "string",
        label: "feature_11",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_12: {
          type: "string",
          label: "feature_12",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_13: {
        type: "string",
        label: "feature_13",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_14: {
          type: "string",
          label: "feature_14",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_15: {
        type: "string",
        label: "feature_15",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_16: {
          type: "string",
          label: "feature_16",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_17: {
        type: "string",
        label: "feature_17",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_18: {
          type: "string",
          label: "feature_18",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_19: {
        type: "string",
        label: "feature_19",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_20: {
          type: "string",
          label: "feature_20",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_21: {
        type: "string",
        label: "feature_21",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_22: {
          type: "string",
          label: "feature_22",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_23: {
          type: "string",
          label: "feature_23",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_24: {
        type: "string",
        label: "feature_24",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_25: {
          type: "string",
          label: "feature_25",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_26: {
        type: "string",
        label: "feature_26",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_27: {
          type: "string",
          label: "feature_27",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_28: {
        type: "string",
        label: "feature_28",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_29: {
          type: "string",
          label: "feature_29",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_30: {
        type: "string",
        label: "feature_30",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
  feature_31: {
          type: "string",
          label: "feature_31",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_32: {
          type: "string",
          label: "feature_32",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_33: {
          type: "string",
          label: "feature_33",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  feature_34: {
          type: "string",
          label: "feature_34",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
  private:{
          type: "string",
          label: "private",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
  },
  supplier:{
          type: "string",
          label: "supplier",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
  },
  company:{
          type: "string",
          label: "company",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
  },
  _id: {
      type: "string",
      label: "_id",
      optional: false,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
  }
});
export default ProductInformationSchema
