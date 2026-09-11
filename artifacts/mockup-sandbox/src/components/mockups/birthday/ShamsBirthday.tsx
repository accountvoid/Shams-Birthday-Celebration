import { useEffect, useMemo, useState } from "react";

import "./_group.css";

/**
 * Edit these values to move the birthday moment. The UTC offset is explicit
 * so the countdown remains correct without relying on the preview machine's zone.
 */
const BIRTHDAY = {
  month: 9,
  day: 12,
  hour: 0,
  minute: 0,
  second: 0,
  timeZone: "Asia/Baghdad",
  utcOffsetMinutes: 180,
} as const;

// مسارات الموارد
const imageSrc = "/images/shams-birthday.png";
const documentSrc =
  "https://github.com/accountvoid/Shams-Birthday-Celebration/releases/download/%D8%B4%D9%85%D8%B3/Dragon.Academy.pdf";

type Phase = "countdown" | "welcome" | "letter" | "note" | "gift" | "final";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function birthdayTimestamp(year: number): number {
  const localAsUtc = Date.UTC(
    year,
    BIRTHDAY.month - 1,
    BIRTHDAY.day,
    BIRTHDAY.hour,
    BIRTHDAY.minute,
    BIRTHDAY.second
  );
  return localAsUtc - BIRTHDAY.utcOffsetMinutes * 60 * 1000;
}

function currentBirthdayTarget(now: Date): number {
  return birthdayTimestamp(now.getUTCFullYear());
}

function getInitialPhase(now: Date): Phase {
  return now.getTime() >= currentBirthdayTarget(now) ? "welcome" : "countdown";
}

function getRemaining(target: number, now: number): Remaining {
  const distance = Math.max(0, target - now);
  const totalSeconds = Math.floor(distance / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function arabicNumber(value: number): string {
  return new Intl.NumberFormat("ar-IQ", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(value);
}

function Countdown({ target }: { target: number }) {
  const [remaining, setRemaining] = useState(() =>
    getRemaining(target, Date.now())
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getRemaining(target, Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const units = useMemo(
    () => [
      { label: "الأيام", value: remaining.days },
      { label: "الساعات", value: remaining.hours },
      { label: "الدقائق", value: remaining.minutes },
      { label: "الثواني", value: remaining.seconds },
    ],
    [remaining]
  );

  return (
    <div className="shams-birthday__countdown" aria-label="الوقت المتبقي">
      {units.map((unit) => (
        <div className="shams-birthday__time" key={unit.label}>
          <strong>{arabicNumber(unit.value)}</strong>
          <span>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function AmbientStars() {
  return (
    <>
      <div className="shams-birthday__stars" aria-hidden="true" />
      <div className="shams-birthday__grain" aria-hidden="true" />
    </>
  );
}

function Progress({ phase }: { phase: Phase }) {
  const steps: Phase[] = ["welcome", "letter", "note", "gift", "final"];
  const current = steps.indexOf(phase);
  return (
    <div className="shams-birthday__progress" aria-hidden="true">
      {steps.map((step, index) => (
        <i className={index <= current ? "is-active" : ""} key={step} />
      ))}
    </div>
  );
}

export function ShamsBirthday() {
  const [phase, setPhase] = useState<Phase>(() =>
    getInitialPhase(new Date())
  );
  const [giftOpen, setGiftOpen] = useState(false);
  const now = new Date();
  const target = currentBirthdayTarget(now);

  useEffect(() => {
    if (phase !== "countdown") return;
    const timer = window.setInterval(() => {
      if (Date.now() >= target) {
        setPhase("welcome");
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [phase, target]);

  const continueTo = (next: Phase) => setPhase(next);

  return (
    <main className="shams-birthday" dir="rtl">
      <AmbientStars />
      <div className="shams-birthday__aurora" aria-hidden="true" />
      <section className="shams-birthday__shell">
        <div className="shams-birthday__card">
          <Progress phase={phase} />

          {phase === "countdown" && (
            <>
              <p className="shams-birthday__eyebrow">إلى شمس، من براء</p>
              <h1 className="shams-birthday__title">
                بقي القليل على يومكِ <em>يا شمس...</em>
              </h1>
              <p className="shams-birthday__subtitle">
                هناك شيء صغير ينتظر منتصف الليل، حين تفتح السماء صفحة جديدة لكِ.
              </p>
              <Countdown target={target} />
              <p className="shams-birthday__signature">
                ١٢ سبتمبر · منتصف الليل · بغداد
              </p>
            </>
          )}

          {phase === "welcome" && (
            <>
              <p className="shams-birthday__eyebrow">لحظتكِ وصلت</p>
              <h1 className="shams-birthday__title">
                كل عام وأنتِ بخير يا شمس ❤️
              </h1>
              <p className="shams-birthday__subtitle">
                في يومكِ، كل ما تمنّيته لكِ صار أقرب إلى الضوء.
              </p>
              <button
                className="shams-birthday__button"
                onClick={() => continueTo("letter")}
                type="button"
              >
                اضغطي هنا ✨
              </button>
            </>
          )}

          {phase === "letter" && (
            <>
              <p className="shams-birthday__eyebrow">رسالة أولى</p>
              <h1 className="shams-birthday__title">إلى شمس ❤️</h1>
              <article className="shams-birthday__letter">
                <p>يا شمس،</p>
                <p>
                  كل عام وأنتِ بخير، وأقرب إلى كل الأشياء التي تشبه قلبكِ.
                  وجودكِ يجعل الأيام أحنّ، ويترك في أبسط اللحظات معنى لا يُنسى.
                </p>
                <p>
                  أتمنى أن يفتح لكِ عامكِ الجديد أبوابًا واسعة للفرح، وأن تظلي
                  دائمًا كما أنتِ: جميلة الروح، فضولية، وقادرة على تحويل الحكايات
                  إلى حياة.
                </p>
                <p>بكل محبة، براء</p>
              </article>
              <button
                className="shams-birthday__button shams-birthday__button--quiet"
                onClick={() => continueTo("note")}
                type="button"
              >
                تابعي الرسالة
              </button>
            </>
          )}

          {phase === "note" && (
            <>
              <p className="shams-birthday__eyebrow">صفحة صغيرة لكِ</p>
              <h1 className="shams-birthday__title">قبل أن تفتحي الهدية</h1>
              <div className="shams-birthday__note">
                <p>
                  هديتكِ يا شمس بكل حب وامتنان، لأنكِ تستحقين كل ما هو أجمل.
                  <br />
                  أتمنى أن تنال إعجابكِ، وتكون بداية لرحلات أجمل في عالم الكتب.
                  <br />— ♡
                </p>
              </div>
              <button
                className="shams-birthday__button"
                onClick={() => continueTo("gift")}
                type="button"
              >
                افتحي الصفحة التالية
              </button>
            </>
          )}

          {phase === "gift" && (
            <>
              <p className="shams-birthday__eyebrow">فصل جديد</p>
              <h1 className="shams-birthday__title">وهذه هديتكِ يا شمس 🎁</h1>
              {!giftOpen ? (
                <div className="shams-birthday__gift-stage">
                  <div className="shams-birthday__gift-wrap">
                    <div
                      className="shams-birthday__gift-halo"
                      aria-hidden="true"
                    />
                    <div
                      className="shams-birthday__sparkles"
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <button
                      aria-label="افتحي الهدية"
                      className="shams-birthday__gift"
                      onClick={() => setGiftOpen(true)}
                      type="button"
                    >
                      <span aria-hidden="true">🎁</span>
                    </button>
                  </div>
                  <p className="shams-birthday__gift-instruction">
                    اضغطي على الهدية لتفتحيها
                  </p>
                </div>
              ) : (
                <>
                  <div className="shams-birthday__gift-stage is-open">
                    <div
                      className="shams-birthday__sparkles"
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="shams-birthday__reveal">
                    <img
                      alt="غلاف أكاديمية التنانين، هدية شمس"
                      className="shams-birthday__image"
                      src={imageSrc}
                    />
                    <div className="shams-birthday__gift-actions">
                      <a
                        className="shams-birthday__button"
                        href={documentSrc}
                        download="Dragon.Academy.pdf"
                        target="_blank"
                        rel="noreferrer"
                      >
                        تحميل أكاديمية التنانين 📥
                      </a>
                      <button
                        className="shams-birthday__button shams-birthday__button--quiet"
                        onClick={() => continueTo("final")}
                        type="button"
                      >
                        أكملي للنهاية
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {phase === "final" && (
            <>
              <div className="shams-birthday__final-mark" aria-hidden="true">
                ♡
              </div>
              <p className="shams-birthday__eyebrow">من قلبي</p>
              <h1 className="shams-birthday__title">
                كل عام وأنتِ بخير يا شمس ❤️
              </h1>
              <p className="shams-birthday__final-copy">
                أتمنى أن تكون هذه الهدية البسيطة قد أسعدتكِ.
              </p>
              <p className="shams-birthday__final-signature">— براء</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default ShamsBirthday;
