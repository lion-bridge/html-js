/** antd form表单的value*/
const formValues = {
  "reconcileBatchId": "1297457537051144192",
  "statementId": "1135506319996735488",
  "reconcileBatchNo": "1297457537051144193",
  "reconcileYear": "2019",
  "reconcileMonth": "6",
  "settlementDate": "2019-06",
  "fileName": "平安健康_标准模板.xlsx",
  "status": "1",
  "upperOrgId": "907538486822191164",
  "upperOrgName": "平安健康",
  "lowerOrgId": "12",
  "conditionType": "2",
  "startDate": "2019-05-27",
  "endDate": "2019-05-27",
  "completeDate": "",
  "createdTime": "2019-06-03 15:33:02",
  "orderCount": "57",
  "totalOrderAmount": "49302.00",
  "totalFee": "10081.66",
  "filePath": "http://oss.zhongbaounion.com/share//billTrans/supplierTransFile/907538486822191164/20190603/20190603191938095003.xlsx",
  "isStanderTemplateFile": "Y",
  "dataRage": "xxx",
  "fileList": [
    {
      "uid": "-1",
      "name": "平安健康_标准模板.xlsx",
      "status": "done"
    }
  ]
};
/** 把普通json转换成antd Form需要的格式，用于this.props.form.setFields(obj) 方法*/
getFields=(json)=>{
  if (!json || typeof json !== 'object' && Object.keys(json).length <= 0) return {};
  let fields = {};
  Object.keys(json).map(key=>{
    fields[key]={value:json[key]}
  });
  return fields;
}