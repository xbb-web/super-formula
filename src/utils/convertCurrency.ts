export const convertCurrency = (num: number) => {
   var fraction = ["角", "分", "厘", "毫"];
   var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
   var unit = [
      ["元", "万", "亿"],
      ["", "拾", "佰", "仟"],
   ];
   var head = num < 0 ? "负" : "";
   num = Math.abs(num);
   var result = "";
   for (var i = 0; i < fraction.length; i++) {
      console.log('pow', Math.floor(num * 10 * Math.pow(10, i)) % 10)
      result += (
         digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, "");
   }
   result = result || "整";
   num = Math.floor(num);
   for (var i = 0; i < unit[0].length && num > 0; i++) {
      var p = "";
      for (var j = 0; j < unit[1].length && num > 0; j++) {
         p = digit[num % 10] + unit[1][j] + p;
         num = Math.floor(num / 10);
      }
      result = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + result;
   }
   return (
      head +
      result.replace(/(零.)*零元/, "元")
         .replace(/(零.)+/g, "零")
         .replace(/^整$/, "零元整")
   );
};
