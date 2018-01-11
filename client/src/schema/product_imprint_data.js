var Schema = require('simpleschema')
/*eslint-disable*/
export const ProductImprintDataSchemas = new Schema({

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
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    imprint_position: {
        type: "string",
        label: "Imprint Position",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    imprint_area: {
        type: "string",
        label: "Imprint Area",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    matrix: {
        type: "string",
        label: "Matrix",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    max_imprint_color_allowed: {
        type: "number",
        label: "Max Imprint Color allowed",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_included: {
        type: "number",
        label: "Price Included",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    max_location_allowed: {
        type: "number",
        label: "Max Location allowed",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    location_price_included: {
        type: "number",
        label: "Location Price Included",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    full_color: {
        type: "string",
        label: "Full Color",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    production_days: {
        type: "number",
        label: "Production Days",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    production_unit: {
        type: "string",
        label: "Production unit",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    setup_charge: {
        type: "string",
        label: "Setup Charge",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    additional_location_charge: {
        type: "string",
        label: "Additional Location Charge",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    additional_color_charge: {
        type: "string",
        label: "Additional Color Charge",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    rush_charge: {
        type: "number",
        label: "Rush Charge",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    ltm_charge: {
        type: "string",
        label: "LTM Charge",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    pms_charge: {
        type: "string",
        label: "PMS Charge",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_1_min: {
        type: "number",
        label: "Qty_1_Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_1_max: {
        type: "number",
        label: "Qty_1_Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_1: {
        type: "number",
        label: "Price_1",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_1: {
        type: "string",
        label: "Code_1",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_2_min: {
        type: "number",
        label: "Qty_2_Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_2_max: {
        type: "number",
        label: "Qty_2_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_2: {
        type: "number",
        label: "Price_2",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_2: {
        type: "string",
        label: "Code_2",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_3_min: {
        type: "number",
        label: "Qty_3_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_3_max: {
        type: "number",
        label: "Qty_3_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_3: {
        type: "number",
        label: "Price_3",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_3: {
        type: "string",
        label: "Code_3",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_4_min: {
        type: "number",
        label: "Qty_4_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_4_max: {
        type: "number",
        label: "Qty_4_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_4: {
        type: "number",
        label: "Price_4",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_4: {
        type: "string",
        label: "Code_4",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_5_min: {
        type: "number",
        label: "Qty_5_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_5_max: {
        type: "number",
        label: "Qty_5_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_5: {
        type: "number",
        label: "Price_5",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_5: {
        type: "string",
        label: "Code_5",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_6_min: {
        type: "number",
        label: "Qty_6_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_6_max: {
        type: "number",
        label: "Qty_6_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_6: {
        type: "number",
        label: "Price_6",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_6: {
        type: "string",
        label: "Code_6",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_7_min: {
        type: "number",
        label: "Qty_7_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_7_max: {
        type: "number",
        label: "Qty_7_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_7: {
        type: "number",
        label: "Price_7",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_7: {
        type: "string",
        label: "Code_7",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_8_min: {
        type: "number",
        label: "Qty_8_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_8_max: {
        type: "number",
        label: "Qty_8_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_8: {
        type: "number",
        label: "Price_8",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_8: {
        type: "string",
        label: "Code_8",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_9_min: {
        type: "number",
        label: "Qty_9_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_9_max: {
        type: "number",
        label: "Qty_9_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_9: {
        type: "number",
        label: "Price_9",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_9: {
        type: "string",
        label: "Code_9",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_10_min: {
        type: "number",
        label: "Qty_10_Min",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_10_max: {
        type: "number",
        label: "Qty_10_Max",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_10: {
        type: "number",
        label: "Price_10",
        max: 200,
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_10: {
        type: "string",
        label: "Code_10",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    fileID: {
        type: "string",
        label: "file ID",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    owner: {
        type: "string",
        label: "owner",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    username: {
        type: "string",
        label: "username",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    type_of_charge:{
        type: "string",
        label: "Type of Charge",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    imprint_method:{
      type: "string",
      label: "Imprint Method",
      optional : true,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    is_pms_color_allow:{
      type: "string",
      label: "Is Pms Color Allow",
      optional : true,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    is_pms_color_allow:{
      type: "string",
      label: "Is Pms Color Allow",
      optional : true,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    },
    _id: {
        type: "string",
        label: "_id",
        optional : true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    }
});

export default ProductImprintDataSchemas
