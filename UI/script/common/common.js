// Các hàm dùng chung toàn chương trình
var CommonFn = CommonFn || {};

// Hàm format số tiền
CommonFn.formatMoney = money => {
    if(money && !isNaN(money)){
        return money.toLocaleString('vi', {style : 'currency', currency : 'VND'});;
    }else{
        return money;
    }
}

// Format ngày tháng
CommonFn.formatDate = dateSrc => {
    let date = new Date(dateSrc),
        year = date.getFullYear().toString(),
        month = (date.getMonth() + 1).toString().padStart(2, '0'),
        day = date.getDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
}
// Format ngày tháng input
CommonFn.formatDate2 = dateSrc => {
    let date = new Date(dateSrc);
    let day = date.getDate() + 1;
    date.setDate(day);
    date = date.toISOString().substring(0, 10);
    return date;

}
// Format lương sang  input
CommonFn.formatMoneyInt = money =>{
    if( typeof  money ==="string"){
      
      money =  money.replaceAll ('.','');
      money = parseInt(money);
      return money;

    }
    else{
        return money;
    }
}

// Format số diện thoại
CommonFn.formatPhone= phone =>{
    let phone1 = phone.substring(0,3);
    let phone2 = phone.substring(3);
    return `${phone1} ${phone2}`;
}

