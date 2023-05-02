interface Product {
  item: string;
  price: number;
}

const calcTotal = (arr: Product[]) : string => {
  let total: number = 0;
  arr.forEach((product: Product) => total += product.price);
  return Number(total).toFixed(2);
}

function countOccurrences(array: Product[], element: Product) {
  let count = 0;
  array.forEach((item) => {
    if (JSON.stringify(item) === JSON.stringify(element)) {
      count++;
    }
  });
  return count;
}

const createList = () => {
  $('.shoppingmenu-list').empty();
  const stringBasket = localStorage.getItem('basket');
  const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
  const uniqueArr = [...new Set(jsonParsedBasket.map(obj => JSON.stringify(obj)))].map(str => JSON.parse(str));
  const uniqueArrSorted: Product[] = uniqueArr.sort((a: Product, b: Product) => {
    const extractNumber = (str: string) => {
      const match = str.match(/\d+/);
      return match ? Number(match[0]) : NaN;
    };
    const numA = extractNumber(a.item);
    const numB = extractNumber(b.item);
    const strA = a.item.toUpperCase().replace(/\d+/g, '').trim();
    const strB = b.item.toUpperCase().replace(/\d+/g, '').trim();
    if (strA < strB) {
      return -1;
    }
    if (strA > strB) {
      return 1;
    }
    return numA - numB;
  });
  const shoppingmenuListItemTotal = $('<p>').addClass('shoppingmenu-list-item-product total').text('Total:');
  const shoppingmenuListItemTotalPrice = $('<p>').addClass('shoppingmenu-list-item-price totalprice').text(`$${calcTotal(jsonParsedBasket)}`);
  uniqueArrSorted.forEach((product: Product, index) => {
    const shoppingmenuListItem = $('<div>').addClass('shoppingmenu-list-item');
    const shoppingmenuListItemInfo = $('<div>').addClass('shoppingmenu-list-item-info');
    const shoppingmenuListItemUpdate = $('<div>').addClass('shoppingmenu-list-item-update');
    const shoppingmenuListItemAmountBox = $('<div>').addClass('shoppingmenu-list-item-amountbox');
    const shoppingmenuListItemButtons = $('<div>').addClass('shoppingmenu-list-item-buttons');
    const shoppingmenuListItemProduct = $('<p>').addClass('shoppingmenu-list-item-product');
    const shoppingmenuListItemPrice = $('<p>').addClass('shoppingmenu-list-item-price');
    const shoppingmenuListItemAmount = $('<p>').addClass('shoppingmenu-list-item-amount');
    const shoppingmenuListItemBin = $('<i>').addClass(`fa-solid fa-trash-can shoppingmenu-list-item-bin bin-${index+1}`);
    const shoppingmenuListItemButtonUp = $('<i>').addClass('fa-solid fa-angle-up shoppingmenu-list-item-buttons-up');
    const shoppingmenuListItemButtonDown = $('<i>').addClass('fa-solid fa-angle-down shoppingmenu-list-item-buttons-down');
    const amount = countOccurrences(jsonParsedBasket, product);
    $('.shoppingmenu-list').append(shoppingmenuListItem);
    shoppingmenuListItem.append(shoppingmenuListItemInfo);
    shoppingmenuListItemInfo.append(shoppingmenuListItemProduct.text(product.item));
    shoppingmenuListItemInfo.append(shoppingmenuListItemPrice.text(`$${product.price}`));
    shoppingmenuListItem.append(shoppingmenuListItemUpdate);
    shoppingmenuListItemUpdate.append(shoppingmenuListItemAmountBox);
    shoppingmenuListItemAmountBox.append(shoppingmenuListItemAmount.text(amount));
    shoppingmenuListItemAmountBox.append(shoppingmenuListItemButtons);
    shoppingmenuListItemButtons.append(shoppingmenuListItemButtonUp);
    shoppingmenuListItemButtons.append(shoppingmenuListItemButtonDown);
    shoppingmenuListItemUpdate.append(shoppingmenuListItemBin);
  });
  const shoppingmenuListItem = $('<div>').addClass('shoppingmenu-list-item');
  const shoppingmenuListItemInfo = $('<div>').addClass('shoppingmenu-list-item-info  shoppingmenu-list-item-totalbox');
  $('.shoppingmenu-list').append(shoppingmenuListItem);
  shoppingmenuListItem.append(shoppingmenuListItemInfo);
  shoppingmenuListItemInfo.append(shoppingmenuListItemTotal);
  shoppingmenuListItemInfo.append(shoppingmenuListItemTotalPrice);
  if (jsonParsedBasket.length > 0){
    $('.product-amount').text(jsonParsedBasket.length);
  } else {
    $('.product-amount').text(0);
  }
}

const changeMenuWidth = () => {
  const screenWidth = $(window).width();
  if (screenWidth && screenWidth < 800) {
    return '-51%';
  } else if (screenWidth && screenWidth > 800 && screenWidth < 1200) {
    return '-34%';
  } else {
    return '-26%';
  }
}

const closeMenuOnResize = () => {
  const screenWidth = $(window).width();
  if (screenWidth && screenWidth < 800) {
    $('.sidemenu, .sidemenu-border').css('margin-left', '-51%');
    $('.shoppingmenu, .shoppingmenu-border').css('margin-right', '-51%');
    $('.foreground').css('display', 'none');
  } else if (screenWidth && screenWidth > 800 && screenWidth < 1200){
    $('.sidemenu, .sidemenu-border').css('margin-left', '-34%');
    $('.shoppingmenu, .shoppingmenu-border').css('margin-right', '-34%');
    $('.foreground').css('display', 'none');
  } else  {
    $('.sidemenu, .sidemenu-border').css('margin-left', '-26%');
    $('.shoppingmenu, .shoppingmenu-border').css('margin-right', '-26%');
    $('.foreground').css('display', 'none');
  }
}

let timeoutId: ReturnType<typeof setTimeout> | undefined;

const basketNotification = () => {
  const jsonStringBasket = localStorage.getItem('basket');
  let storedValue: Product[] = []
  if (jsonStringBasket) {
    storedValue = JSON.parse(jsonStringBasket);
  };
  const text = $('<p>').text(`${storedValue.at(-1)!.item} has been added to your basket!`)
  const navUp = $('.nav-up');
  if (navUp) {
    $('header').removeClass('nav-up').addClass('nav-down');
  }
  const notification = $('.notification');
  const notificationBox = $('.notification-box');
  if (notification) {
    notification.empty();
    notification.append(text);
    notificationBox.css('top', '15vh');
    notificationBox.css('margin-right', '0');
    $('.loading-bar').css('transition', '3s linear');
    $('.loading-bar').css('width', '0');
    if (typeof timeoutId !== 'undefined') {
      clearTimeout(timeoutId);
      $('.loading-bar').css('transition', '0s');
      $('.loading-bar').css('width', 'calc(100% - 1px)');
      setTimeout(() => {
        $('.loading-bar').css('transition', '3s linear');
        $('.loading-bar').css('width', '0');
      }, 1)
    }
    timeoutId = setTimeout(() => {
      notificationBox.css('margin-right', '-101vw');
      setTimeout(() => {
        $('.loading-bar').css('transition', '0s');
        $('.loading-bar').css('width', 'calc(100% - 1px)');
      }, 300)
    }, 3000);
  }
};

const checkDistance = () => {
  const element = $('.main').children();
  const distanceArr: number[] = [];
  for (let i=0; i<element.length; i++) {
    const child = element.eq(i);
    const childTop = child.offset()?.top ?? 0;
    const childHeight = child.outerHeight() ?? 0;
    const distanceFromTop = childTop + (childHeight / 2);
    distanceArr.push(distanceFromTop);
  }
  return distanceArr;
};

const highlightBox = () => {
  const element = $('.main').children();
  const distanceArr = checkDistance();
  distanceArr.forEach((box: number, index: number) => {
    if (($(window).scrollTop() ?? 0) < box && ($(window).scrollTop() ?? 0) >= (distanceArr[index - 1] ?? -Infinity)) {
      element.eq(index).css('box-shadow', '0 0 15px 0px rgb(40, 68, 40)');
    } else {
      element.eq(index).css('box-shadow', '0 0 15px -6px rgb(40, 68, 40)');
    }
  })
}

$(document).ready(() => {
  checkDistance();
  const basket: Product[] = [];
  const jsonStringBasket = JSON.stringify(basket);
  const storedValue = localStorage.getItem('basket');
  if (!storedValue) {
  localStorage.setItem('basket', jsonStringBasket);
  };
  createList();
  let offset: string = '';
  const screenWidth = $(window).width();
  if (screenWidth && screenWidth < 800) {
    offset = '-51%';
  } else if (screenWidth && screenWidth > 800 && screenWidth < 1200) {
    offset = '-34%';
  } else {
    offset = '-26%'
  }
  $(window).on('resize', function() {
    closeMenuOnResize();
    offset = changeMenuWidth();
  });
  if (($(window).width() ?? 0) < 600) {
    $(window).on('scroll', () => {
      setTimeout(() => {
        highlightBox();
      }, 150)
    });
  }
  $('.menu-icon').click(() => {
    $('.sidemenu, .sidemenu-border').animate({ 'margin-left': '0px' }, 300);
    $('.foreground').fadeIn(300);
  });
  $('.shopping-icon').click(() => {
    $('.shoppingmenu, .shoppingmenu-border').animate({ 'margin-right': '0px' }, 300);
    $('.foreground').fadeIn(300);
  })
  $('.foreground').click(() => {
    $('.sidemenu, .sidemenu-border').animate({ 'margin-left': offset }, 300);
    $('.shoppingmenu, .shoppingmenu-border').animate({ 'margin-right': offset}, 300);
    $('.foreground').fadeOut(300);
  });
  $('.plant1').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 1', price: 11.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant2').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 2', price: 13.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant3').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 3', price: 8.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant4').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 4', price: 15.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant5').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 5', price: 12.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant6').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 6', price: 5.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant7').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 7', price: 20.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant8').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 8', price: 11.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant9').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 9', price: 16.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant10').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 10', price: 25.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant11').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 11', price: 21.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant12').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 12', price: 9.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant13').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 13', price: 18.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant14').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 14', price: 23.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant15').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 15', price: 29.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });
  $('.plant16').click(() => {
    const stringBasket = localStorage.getItem('basket');
    const jsonParsedBasket: Product[] = stringBasket ? JSON.parse(stringBasket) : [];
    jsonParsedBasket.push({item: 'Plant 16', price: 13.99});
    const updatedValue = JSON.stringify(jsonParsedBasket);
    localStorage.setItem('basket', updatedValue);
    createList();
    basketNotification();
  });

  let didScroll: boolean;
  let lastScrollTop = 0;
  const delta = 5;
  const navbarHeight = $('header').outerHeight();
  
  $(window).scroll(() => {
    didScroll = true;
  });
  
  setInterval(() => {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 150);
  
  function hasScrolled() {
    const st = $(window).scrollTop();
    if (st && Math.abs(lastScrollTop - st) <= delta) {
      return;
    }
    if (st && navbarHeight && st > lastScrollTop && st > navbarHeight) {
      $('header').removeClass('nav-down').addClass('nav-up');
      $('.notification-box').css('top', '0');
    } else {
      if (st && st + $(window).height()! < $(document).height()!) {
        $('header').removeClass('nav-up').addClass('nav-down');
        $('.notification-box').css('top', '15vh');
      }
    }
    if (st) {
      lastScrollTop = st;
    }
  }

  $('body').on('click', '.shoppingmenu-list-item-bin', (event) => {
    const trashCan = $(event.target);
    const basketString = localStorage.getItem('basket');
    const basketParsed: Product[] = basketString ? JSON.parse(basketString) : [];
    const plant = trashCan.parent().prev().children().first().text();
    const filteredBasket = basketParsed.filter((x: Product) => x.item !== plant);
    localStorage.setItem('basket', JSON.stringify(filteredBasket));
    trashCan.parent().parent().remove();
    $('.totalprice').text(`$${calcTotal(filteredBasket)}`);
  });

  $('body').on('click', '.shoppingmenu-list-item-buttons-up', (event) => {
    const buttonUp = $(event.target);
    const basketString = localStorage.getItem('basket');
    const basketParsed: Product[] = basketString ? JSON.parse(basketString) : [];
    const plant = buttonUp.parent().parent().parent().prev().children().first().text();
    const price = buttonUp.parent().parent().parent().prev().children().eq(1).text().substring(1);
    const product: Product = {item: plant, price: Number(price)}
    basketParsed.push(product);
    localStorage.setItem('basket', JSON.stringify(basketParsed));
    const amountPlant = Number(buttonUp.parent().prev().text());
    const amountProducts = Number($('.product-amount').text());
    buttonUp.parent().prev().text(amountPlant+1);
    $('.product-amount').text(amountProducts + 1);
    $('.totalprice').text(`$${calcTotal(basketParsed)}`);
  })
  $('body').on('click', '.shoppingmenu-list-item-buttons-down', (event) => {
    const buttonUp = $(event.target);
    const basketString = localStorage.getItem('basket');
    const basketParsed: Product[] = basketString ? JSON.parse(basketString) : [];
    const plant = buttonUp.parent().parent().parent().prev().children().first().text();
    const price = buttonUp.parent().parent().parent().prev().children().eq(1).text().substring(1);
    const product: Product = {item: plant, price: Number(price)}
    let found = false;
    const filteredArr = basketParsed.filter((obj) => {
      if (!found && obj.item === product.item) {
        found = true;
        return false;
      }
      return true;
    });
    localStorage.setItem('basket', JSON.stringify(filteredArr));
    const amountPlant = Number(buttonUp.parent().prev().text());
    const amountProducts = Number($('.product-amount').text());
    if (amountPlant === 1) {
      buttonUp.parent().parent().parent().parent().remove();
    } else {
      buttonUp.parent().prev().text(amountPlant - 1);
    }
    $('.product-amount').text(amountProducts - 1);
    $('.totalprice').text(`$${calcTotal(filteredArr)}`);
  })
});