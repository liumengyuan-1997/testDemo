export const formateDate = (str) => {
  if (!str) return ""
  var newstr = new Date(str);
  var y = newstr.getFullYear();
  var m = newstr.getMonth() + 1;
  var d = newstr.getDate();
  var h = newstr.getHours();
  var min = newstr.getMinutes();
  var s = newstr.getSeconds();
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}