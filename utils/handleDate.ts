/*
 * @Author: xzt
 * @Date: 2020-04-24 14:06:41
 * @Last Modified by: xzt
 * @Last Modified time: 2020-04-24 14:07:33
 */

/**
 * 处理日期
 * @param {string} res 日期
 */
export function handleDate (res) {
  // 字符串首增加0
  function addZero (str, len, count) {
    for (let i = 0; i < (count - len); i++) {
      str = '0' + str;
    }

    return str;
  }

  let d = new Date(res);
  let mo = '' + (d.getMonth() + 1);
  let da = '' + d.getDate();
  let ho = '' + d.getHours();
  let mi = '' + d.getMinutes();
  let se = '' + d.getSeconds();
  let ms = '' + d.getMilliseconds();

  return {
    year: '' + d.getFullYear(),
    month: addZero(mo, mo.length, 2),
    date: addZero(da, da.length, 2),
    hours: addZero(ho, ho.length, 2),
    minutes: addZero(mi, mi.length, 2),
    seconds: addZero(se, se.length, 2),
    milliseconds: addZero(ms, ms.length, 3)
  };
}
