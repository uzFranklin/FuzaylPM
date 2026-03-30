# AI Image Mode V2

Bu hujjat 3-bo'limni haqiqiy AI rejimiga o'tkazish uchun tayyor texnik asosdir.

## Maqsad

Foydalanuvchi matematika topshiriqlari bor sahifa rasmini yuklaydi.
Tizim:

1. rasmdagi topshiriqlar matnini o'qiydi;
2. topshiriq turlarini aniqlaydi;
3. uslub, qiyinlik va mavzuni tushunadi;
4. shu namunaga o'xshash yangi topshiriqlar yaratadi;
5. 7 kun x 15 savol formatida PDF uchun tayyorlaydi.

## Kerakli qismlar

- Frontend: rasm yuklash formasi
- Backend API: rasmni OpenAI ga yuborish
- AI parsing: rasm asosida topshiriqlarni tahlil qilish
- AI generation: o'xshash yangi topshiriqlar yaratish
- Validation: javoblar va formatni tekshirish
- PDF output: A4 sahifalar

## Tavsiya etilgan stack

- Next.js
- TypeScript
- OpenAI API
- Server-side route yoki server action
- HTML print layout yoki PDF export

## Ishlash oqimi

1. User rasm yuklaydi.
2. Backend rasmni OpenAI Vision modeliga yuboradi.
3. Model quyidagilarni qaytaradi:
   - tasks_text
   - topics
   - difficulty
   - task_patterns
   - language
4. Ikkinchi so'rov orqali AI 15 ta yangi savol yaratadi.
5. Shu jarayon 7 kunlik reja asosida takrorlanadi.
6. Natija saytga chiqariladi va PDF uchun tayyorlanadi.

## Muhim qoida

AI eski topshiriqlarni ko'chirmasligi kerak.
Faqat uslub, mantiq va formatni olib, yangi sonlar va yangi shartlar bilan yangi savollar tuzishi kerak.

## JSON format

AI quyidagi formatda qaytishi kerak:

```json
{
  "source_analysis": {
    "language": "uz",
    "grade_level": "5-sinf",
    "topics": ["kasrlar", "geometriya"],
    "style_notes": [
      "qisqa test uslubi",
      "matnli mantiqiy savollar",
      "hisoblash va geometriya aralash"
    ],
    "task_patterns": [
      "fraction-of-total",
      "perimeter",
      "time-difference",
      "sequence-gap"
    ]
  },
  "weekly_plan": [
    {
      "day": 1,
      "focus": "yengil kirish",
      "questions": [
        {
          "text": "Savol matni",
          "answer": "12"
        }
      ]
    }
  ]
}
```

## Validation qoidalari

- Har kuni aniq 15 savol
- Har savolda aniq 1 ta to'g'ri javob
- Savollar bir-birini takrorlamasligi kerak
- 7 kun davomida qiyinlik asta-sekin o'sishi kerak
- Til: o'zbekcha
- Format: chop etishga qulay

## MVP va keyingi bosqich

Hozirgi lokal sayt:
- fayl yuklashni ko'rsatadi
- izoh asosida o'xshash savol yaratadi

To'liq AI rejim uchun keyingi bosqich:
- OpenAI API ulash
- rasmni backend orqali yuborish
- AI parse + AI generate pipeline
- server-side PDF
