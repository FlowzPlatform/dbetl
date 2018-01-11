var Schema = require('simpleschema')

/*eslint-disable*/
export const ProductPriceSchema = new Schema({
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
    price_type: {
        type: "string",
        label: "Price Type",
        allowedValues: ['regular', 'piece_wise_price', 'call_for_price'],
        optional: true,
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    type: {
        type: "string",
        label: "Type",
        allowedValues: ['decorative', 'blank', 'special', 'special_blank'],
        optional: true,
        defaultValue: '',
        maxLength : '',
        regEx:''
        //msg : "Language type not allow this value"
    },
    global_price_type: {
        type: "string",
        label: "Global Price Type",
        allowedValues: ['global', 'above_catalog', 'oversease'],
        optional: true,
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
    price_unit: {
        type: "string",
        label: "Price Unit",
        allowedValues: ['box', 'dozen', 'each', 'pack', 'pair', 'set'],
        optional: true,
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_1_min: {
        type: "number",
        label: "Qty1 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_1_max: {
        type: "number",
        label: "Qty1 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_1: {
        type: "number",
        label: "Price1",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_1: {
        type: "string",
        label: "Code1",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_2_min: {
        type: "number",
        label: "Qty2 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_2_max: {
        type: "number",
        label: "Qty2 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_2: {
        type: "number",
        label: "Price2",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_2: {
        type: "string",
        label: "Code2",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_3_min: {
        type: "number",
        label: "Qty3 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_3_max: {
        type: "number",
        label: "Qty3 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_3: {
        type: "number",
        label: "Price3",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_3: {
        type: "string",
        label: "Code3",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_4_min: {
        type: "number",
        label: "Qty4 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_4_max: {
        type: "number",
        label: "qty4 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_4: {
        type: "number",
        label: "Price4",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_4: {
        type: "string",
        label: "Code4",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_5_min: {
        type: "number",
        label: "Qty5 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_5_max: {
        type: "number",
        label: "Qty5 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_5: {
        type: "number",
        label: "Price5",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_5: {
        type: "string",
        label: "Code5",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_6_min: {
        type: "number",
        label: "Qty6 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_6_max: {
        type: "number",
        label: "Qty6 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_6: {
        type: "number",
        label: "Price6",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_6: {
        type: "string",
        label: "Code6",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_7_min: {
        type: "number",
        label: "Qty7 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_7_max: {
        type: "number",
        label: "Qty7 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_7: {
        type: "number",
        label: "Price7",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_7: {
        type: "string",
        label: "Code7",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },

    qty_8_min: {
        type: "number",
        label: "Qty8 Min",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    qty_8_max: {
        type: "number",
        label: "Qty8 Max",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    price_8: {
        type: "number",
        label: "Price8",
        max: 200,
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    code_8: {
        type: "string",
        label: "Code8",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    _id:{
      type: "string",
      label: "id",
      optional: true,
      allowedValues: [],
      defaultValue: '',
      maxLength : '',
      regEx:''
    }
});

export default ProductPriceSchema
