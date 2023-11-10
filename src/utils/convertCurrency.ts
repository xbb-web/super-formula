export const convertCurrency = (n) => {
   var fraction = ['角', '分', '厘', '毫'];
   var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
   ];
   var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
   ];
   var head = n < 0 ? '负' : '';
   n = Math.abs(n);
   var s = n.toString();
   console.log('s', s.split('.'))
   var integerPart = s.split('.')[0];
   var decimalPart = s.split('.')[1] || '';
   var r = r || "整";
   for (var i = 0; i < unit[0].length && integerPart > 0; i++) {
      var t = '';
      for (var j = 0; j < unit[1].length && integerPart > 0; j++) {
         t = digit[integerPart % 10] + unit[1][j] + t;
         integerPart = Math.floor(integerPart / 10);
      }
      r = t.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + r;
   }
   console.log('r', r)
   return (
      head +
      r.replace(/(零.)*零元/, '元')
         .replace(/(零.)+/g, '零')
         .replace(/^整$/, '零元整') +
      decimalPart.split('').map(function (v, i) {
         return (digit[v] + fraction[i]);
      }).join('')
   );
};
