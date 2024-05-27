// @ts-nocheck

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

/* eslint-disable */
export const leftPad = (a, b, c) => {
  let d = String(a);
  for (c || (c = " "); d.length < b; )
    d = c + d;
  return d.toString()
};

/* eslint-disable */
export const numberFormat = (a, b) => {
  var c = "",
  d = a + "";
  if (/%$/.test(b)) {
    c = "%",
    a = 100 * a,
    b = b.replace("%", "");
    var e = d.indexOf(".");
    if (e > -1) {
      var f = d.length - 3 - e;
      f = f < 0 ? 0 : f > 8 ? 8 : f,
      a = parseFloat(a.toFixed(f))
    }
    d = a + ""
  }
  var g = b.split("."),
  h = g[0],
  i = g[1];
  if ("" !== i) {
    var j = i ? i.length : 0;
    d = parseFloat(a).toFixed(j);
    for (var k = d.split(""), l = j; l > 0 && "#" === i.charAt(l - 1); l--) {
      var m = k.pop();
      if ("0" !== m) {
        k.push(m);
        break
      }
    }
    var n = k.pop();
    "." === n && (n = ""),
    d = k.join("") + n
  }
  var o = d.split("."),
  p = o[0];
  if (/,/.test(h))
    o[0] = p.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
  else {
    var q = h.match(/[0]+[0#]*$/);
    q && q.length > 0 && (o[0] = leftPad(p, q[0].length, "0"))
  }
  return o.join(".") + c
}
