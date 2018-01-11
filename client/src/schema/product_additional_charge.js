var Schema = require('simpleschema')
/*eslint-disable*/
export const ProductAdditionalChargeSchemas = new Schema({
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
      charge_name: {
          type: "string",
          label: "Charge Name",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
      option_name: {
          type: "string",
          label: "Option Name",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
      moq: {
          type: "string",
          label: "MOQ",
          optional: true,
          allowedValues: [],
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
          type: "number",
          label: "Code1",
          optional: true,
          allowedValues: [],
          defaultValue: '',
          maxLength : '',
          regEx:''
      },
      Net_Price_1: {
          type: "number",
          label: "Net Price 1",
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
    Net_Price_2: {
        type: "number",
        label: "Net Price 2",
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
    Net_Price_3: {
        type: "number",
        label: "Net Price 3",
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
    Net_Price_4: {
        type: "number",
        label: "Net Price 4",
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
    Net_Price_5: {
        type: "number",
        label: "Net Price 5",
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
    Net_Price_6: {
        type: "number",
        label: "Net Price 6",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    fileID: {
        type: "string",
        label: "file ID",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    owner: {
        type: "string",
        label: "owner",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    username: {
        type: "string",
        label: "username",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    },
    _id: {
        type: "string",
        label: "_id",
        optional: true,
        allowedValues: [],
        defaultValue: '',
        maxLength : '',
        regEx:''
    }
});

export default ProductAdditionalChargeSchemas
