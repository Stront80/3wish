/*
  ИНТЕРАКТИВНОСТЬ САЙТА
  Этот файл работает в браузере и не требует сборки. Здесь нет серверного кода.
  В частности, форма проверяет введённые данные и формирует mailto-ссылку:
  она открывает почтовое приложение пользователя, но не отправляет письмо сама.
*/
// Мобильное меню: переключаем класс open, доступное состояние кнопки и символ меню.
const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');
menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'✕':'☰'});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.textContent='☰'}));
// Год в подвале всегда соответствует текущему году в браузере.
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
// Форма заявки: если на странице нет формы, остальной скрипт продолжает работать без ошибки.
const form=document.querySelector('#application-form');
if(form){
 const statusBox=form.querySelector('.form-status');const submit=form.querySelector('.submit-button');
 // Показываем ошибку рядом с полем и помечаем его для вспомогательных технологий.
 function setError(input,message){const label=input.closest('label');const error=label?.querySelector('.field-error');if(error)error.textContent=message;input.setAttribute('aria-invalid',message?'true':'false')}
 form.querySelectorAll('input:not([type=checkbox]),select,textarea').forEach(input=>input.addEventListener('input',()=>setError(input,'')));
 // При отправке сначала отменяем стандартную отправку формы и проверяем поля на клиенте.
 form.addEventListener('submit',event=>{
  event.preventDefault();statusBox.className='form-status';statusBox.textContent='';let valid=true;
  const name=form.elements.name,phone=form.elements.phone,email=form.elements.email,type=form.elements.clientType,task=form.elements.task,consent=form.elements.consent;
  [[name,name.value.trim().length>=2,'Введите имя (не менее 2 символов).'],[phone,/^[+()\d\s-]{7,25}$/.test(phone.value.trim()),'Введите корректный номер телефона.'],[email,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),'Введите корректный адрес электронной почты.'],[type,!!type.value,'Выберите тип клиента.'],[task,task.value.trim().length>=10,'Опишите задачу подробнее (не менее 10 символов).']].forEach(([input,ok,message])=>{setError(input,ok?'':message);if(!ok)valid=false});
  const consentError=form.querySelector('.consent-error');consentError.textContent=consent.checked?'':'Необходимо согласие на обработку персональных данных.';if(!consent.checked)valid=false;
  if(!valid){statusBox.className='form-status error';statusBox.textContent='Пожалуйста, проверьте поля формы.';form.querySelector('[aria-invalid="true"]')?.focus();return}
  // Собираем текст письма. encodeURIComponent ниже защищает спецсимволы в теме и теле mailto.
  const clientType=type.value==='business'?'Бизнес':'Частное лицо';
  const body=['Новая заявка с сайта «Три желания»','',`Имя: ${name.value.trim()}`,`Телефон: ${phone.value.trim()}`,`Email клиента: ${email.value.trim()}`,`Тип клиента: ${clientType}`,'',`Описание задачи:\n${task.value.trim()}`,'','Согласие на обработку персональных данных: дано','Источник: GitHub Pages (статическая версия)'].join('\n');
  const mailto=`mailto:mailbox@familypost.ru?subject=${encodeURIComponent('Заявка с сайта «Три желания»')}&body=${encodeURIComponent(body)}`;
  statusBox.className='form-status success';statusBox.textContent='Откроется ваше почтовое приложение с подготовленной заявкой. Чтобы отправить её, нажмите «Отправить» в почтовом приложении.';
  // Это не редирект на сайт: mailto открывает почтовый клиент для ручной отправки заявки.
  window.location.href=mailto;
 });
}
