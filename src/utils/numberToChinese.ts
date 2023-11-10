export const numberToChinese = (num: number) => {
  var arr1 = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var arr2 = [
    "",
    "十",
    "百",
    "千",
    "万",
    "十",
    "百",
    "千",
    "亿",
    "十",
    "百",
    "千",
    "万",
    "十",
    "百",
    "千",
    "亿",
  ];
  //num为0
  if (!num) return "〇";
  var str = num.toString().split("");
  var integer_str: any = [];
  var float_str: any = [];
  var integer_result = "";
  var float_result = "";
  var result = "";
  if (num < 0) {
    str = num.toString().slice(1).split("");
  }
  //处理小数
  if (str.indexOf(".") !== -1) {
    integer_str = str.slice(0, str.indexOf("."));
    float_str = str.slice(str.indexOf(".") + 1);
    float_result = ".";
    for (var i = 0; i < float_str.length; i++) {
      var index = Number(float_str[i]);
      float_result = float_result + arr1[index];
    }
  }
  // 处理整数部分
  str = integer_str.length > 0 ? integer_str : str;
  for (var i = 0; i < str.length; i++) {
    var des_i = str.length - 1 - i;
    integer_result = arr2[i] + integer_result;
    var arr1_index = str[des_i];
    integer_result = arr1[arr1_index] + integer_result;
  }
  integer_result = integer_result
    .replace(/〇(千|百|十)/g, "〇")
    .replace(/十〇/g, "十");
  integer_result = integer_result.replace(/〇+/g, "〇");
  integer_result = integer_result.replace(/〇亿/g, "亿").replace(/〇万/g, "万");
  integer_result = integer_result.replace(/亿万/g, "亿");
  integer_result = integer_result.replace(/〇+$/, "");
  float_result = float_result.replace(/〇+$/, "");
  result = integer_result + float_result;
  if (num > 0) return result;
  else {
    return "-" + result;
  }
};
