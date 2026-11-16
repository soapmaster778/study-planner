# Лабораторна робота №9

Тема: React State та Effects — Context API, useReducer, useEffect і Custom Hooks.

Мета: організувати спільний стан Study Planner, зберегти можливості роботи №8,
додати редагування, persistence, повідомлення та Undoable Delete.

## Опрацьовані матеріали

1. [Managing State](https://uk.react.dev/learn/managing-state).
2. [Sharing State Between Components](https://uk.react.dev/learn/sharing-state-between-components).
3. [Extracting State Logic into a Reducer](https://uk.react.dev/learn/extracting-state-logic-into-a-reducer).
4. [Scaling Up with Reducer and Context](https://uk.react.dev/learn/scaling-up-with-reducer-and-context).
5. [Synchronizing with Effects](https://uk.react.dev/learn/synchronizing-with-effects).
6. [Reusing Logic with Custom Hooks](https://uk.react.dev/learn/reusing-logic-with-custom-hooks).

Reducer обчислює наступний стан без мутацій і побічних ефектів.
Context передає стан і операції компонентам без зайвих проміжних props.
Effects синхронізують React із localStorage, document.title та таймерами.
Custom Hooks повторно використовують логіку доступу до контексту та сховища.

## Відповідність основним вимогам

| Вимога | Реалізація |
|---|---|
| Продовження №8 | Збережено форму, картки, фільтри, статистику та порожні стани |
| useReducer | TaskProvider, reducer у reducers/taskReducer.ts |
| Типізовані дії | TaskAction — discriminated union у types/task.ts |
| Чистота reducer | Немає DOM, localStorage, генерації id або таймерів |
| Редагування | TaskForm з початковими полями завдання, updateTask та action update |
| Context API | TaskContext та TaskProvider |
| Custom Hooks | useTaskContext та useLocalStorage<T> |
| Persistence | Читання в initializer, запис у Effect, валідація JSON |
| Заголовок вкладки | document.title в Effect із залежністю activeCount |
| Toast | Власний компонент, автоматичне закриття, повідомлення помилок |
| Undoable Delete | Масив pendingDeletes, незалежні таймери на 5 секунд, Undo та прогрес для кожного завдання |
| Cleanup | clearTimeout і clearInterval при зміні операції та unmount |
| Скидання | action reset, очищення pending deletion і режиму редагування |
| Derived state | Фільтрація та статистика обчислюються під час render |
| Стилізація | Bootstrap, без другої системи стилів |

Масове видалення виконаних є додатковим завданням з окремим undo-flow,
тому дія clearCompleted і відповідна кнопка не додаються до основної реалізації.

## Сценарій захисту

1. Створити завдання й показати Toast.
2. Відредагувати назву, опис, категорію та пріоритет.
3. Почати видалення, показати прогрес і натиснути «Скасувати».
4. Повторити видалення та дочекатися остаточного видалення через 5 секунд.
5. Перезавантажити сторінку й показати збережені дані та фільтр.
6. Показати useTaskContext у TaskList або TaskStats.
7. Показати useReducer, Effects і cleanup у TaskProvider.
8. Показати useLocalStorage для фільтра.

## Контрольні запитання

1. **Коли піднімати state?** Коли кілька компонентів повинні використовувати
   й узгоджено змінювати ті самі дані. Стан належить найближчому спільному батьку.
2. **Що таке prop drilling?** Передавання даних через проміжні компоненти,
   яким вони не потрібні. Context надає доступ до даних компонентам нижче Provider.
3. **Що таке reducer?** Функція, яка приймає поточний стан і action та повертає
   наступний стан. Вона централізує правила різних пов'язаних оновлень.
4. **Якою має бути чиста reducer-функція?** Для однакових аргументів давати
   однаковий результат, не мутувати вхідні дані та не виконувати побічних ефектів.
5. **Що таке action і dispatch?** Action описує подію та її payload.
   Dispatch передає action React, який застосовує reducer для оновлення стану.
6. **Коли useReducer доцільніший за useState?** Коли є кілька пов'язаних
   переходів стану, складні правила або потреба окремо тестувати ці правила.
7. **Що таке Context API?** createContext створює контекст, Provider передає
   значення, useContext читає найближче значення відповідного Provider.
8. **Чи потрібен весь state у Context?** Ні. Чернетку полів зручно залишити
   локальною у формі, а спільні завдання та операції надати через Context.
9. **Що таке side effect?** Взаємодія із зовнішнім середовищем: запис у сховище,
   зміна заголовка документа, створення таймера або мережевий запит.
10. **Для чого useEffect?** Для синхронізації компонента із зовнішньою системою
    після застосування оновлень інтерфейсу.
11. **Коли виконується Effect і cleanup?** Effect запускається після монтування
    та після зміни залежностей. Cleanup попереднього запуску виконується перед
    наступним запуском і при unmount. StrictMode додатково перевіряє цей цикл у розробці.
12. **Чому localStorage — побічний ефект?** Запис змінює зовнішнє браузерне
    сховище, яке існує незалежно від обчислення JSX.
13. **Чому таймер не можна створювати в reducer?** Створення таймера змінює
    зовнішнє середовище. Reducer може викликатися повторно, тому це спричиняло б
    зайві таймери та порушувало чистоту.
14. **Навіщо clearTimeout у cleanup?** Щоб Undo, reset, нова операція або unmount
    не залишали активним таймер застарілого видалення.
15. **Чому не дублювати derived state?** Дублікати можуть розсинхронізуватися.
    Статистику та відфільтрований список достатньо обчислювати з tasks і filter.
16. **Що таке Custom Hook?** Функція з префіксом use, яка поєднує hooks для
    повторного використання логіки. Вона ділиться логікою, а не автоматично спільним станом.
17. **Які правила Custom Hooks?** Викликати hooks на верхньому рівні компонента
    або іншого hook, зберігати порядок викликів, указувати залежності Effects
    та повертати cleanup для ресурсів, які цього потребують.
