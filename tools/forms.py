#!/usr/bin/env python3
"""Expands the lemmas of REQ-3314, REQ-3320 and REQ-3324 into content/shaming.ru.json (ADR-0160, TSK-0680).

The forms come from pymorphy3, whose dictionary is OpenCorpora's. Only the expanded list is committed,
so the run-time check needs no morphology library. Each entry keeps the lemma it came from, so the
owner reviews the file by lemma. Run:

    python3 -m pip install --target /tmp/pm pymorphy3 pymorphy3-dicts-ru
    PYTHONPATH=/tmp/pm python3 -I tools/forms.py
"""
import itertools
import json
import sys

sys.path.insert(0, "/tmp/pm")
import pymorphy3  # noqa: E402

morph = pymorphy3.MorphAnalyzer()


def fold(word: str) -> str:
    return word.lower().replace("ё", "е")


def forms(lemma: str) -> list[str]:
    """Every form of the lemma's dictionary entry, folded and sorted."""
    parsed = morph.parse(lemma)[0]
    return sorted({fold(f.word) for f in parsed.lexeme})


# REQ-3314: the words, with the diminutives that are natural Russian.
WORDS = {
    "неправильно": [],
    "неверно": [],
    "ошибка": ["ошибочка"],
    "ошибиться": [],
    "промах": ["промашка"],
    "мимо": [],
    "провал": [],
    "жаль": [],
    "плохо": [],
    "неудача": ["неудачка"],
    "задача": ["задачка", "задачник"],
    "пример": ["примерчик"],
    "урок": ["урочок"],
    "школа": ["школка"],
    "оценка": ["оценочка"],
    "умница": ["умничка"],
    "гений": [],
}


def entry(lemma: str, extra: list[str]) -> dict:
    out = set(forms(lemma))
    for d in extra:
        out.update(forms(d))
    return {"lemma": lemma, "diminutives": extra, "forms": sorted(out)}


def runs(*slots: list[str]) -> list[list[str]]:
    """Every run of tokens made by taking one option from each slot."""
    return [list(run) for run in itertools.product(*slots)]


def phrase(lemma: str, *slots: list[str]) -> dict:
    return {"phrase": lemma, "runs": sorted(runs(*slots))}


neg = ["не"]
smart = sorted({fold(f.word) for w in ("умный",) for f in morph.parse(w)[0].lexeme if f.word in
                {"умная", "умный", "умна", "умное", "умные", "умны", "умен"}})

PHRASES = [
    phrase("не получилось", neg, forms("получиться")),
    phrase("не смогла", neg, forms("смочь")),
    phrase("ты не поняла", ["ты"], neg, forms("понять")),
    phrase("это же просто", ["это"], ["же"], ["просто"]),
    phrase("ты умная", ["ты"], smart),
    phrase("ты самая умная", ["ты"], ["самая", "самый", "самое"], smart),
]

# REQ-3324: she is never told she has run out of guiding threads.
SHORTAGE = [
    phrase("нити закончились", forms("нить"), forms("закончиться")),
    phrase("нитей не осталось", forms("нить"), neg, forms("остаться")),
    phrase("нет нитей", ["нет"], forms("нить")),
]

# REQ-3312: labels the interface never uses, compared after trimming and folding case.
REJECTED_LABELS = [
    "Правильный ответ", "Решение", "Твой ответ", "Проверить", "Подсказка", "Сдаться",
    "Верно", "Выйти", "Пауза", "Серия", "Дней подряд",
]
# REQ-3312: a time left is a clock, so these shapes are refused anywhere in a ui value.
LABEL_PATTERNS = [r"осталось \d+ минут", r"через \d+ минут"]

data = {
    "version": "v1",
    "forms": [entry(l, d) for l, d in WORDS.items()],
    "phrases": PHRASES,
    "shortage": SHORTAGE,
    "rejectedLabels": REJECTED_LABELS,
    "labelPatterns": LABEL_PATTERNS,
    # REQ-3320: the knot is never «узелок» in the keys that name it.
    "knot": {
        "keys": ["ui.task.", "ui.outcome.", "ui.scheme.", "system.knot."],
        **entry("узелок", []),
    },
    "fixtures": {
        "match": ["ошибкой", "задачку", "Урок", "ОЦЕНКА", "зaдача", "ошиблась"],
        "knot": ["узелком"],
        "pass": ["примерно", "примерить", "мимоза", "верно"],
    },
}
with open("content/shaming.ru.json", "w", encoding="utf-8") as out:
    json.dump(data, out, ensure_ascii=False, indent=1)
    out.write("\n")
print(
    "lemmas", len(data["forms"]),
    "forms", sum(len(e["forms"]) for e in data["forms"]),
    "phrases", len(PHRASES) + len(SHORTAGE),
    "runs", sum(len(p["runs"]) for p in PHRASES + SHORTAGE),
)
