import { useEffect, useState } from "react";
import Starfield from "./Starfield";

type Work = {
  index: string;
  title: string;
  note: string;
  detail?: string;
  role?: string;
  tags?: string[];
  image?: string;
  images?: string[];
  imageAlt?: string;
};

const works: Work[] = [
  {
    index: "01",
    title: "节卡（JAKA）π仔机器人开发",
    note: "机器人开发",
    detail:
      "负责骨骼映射模仿，以及人脸识别里的 YOLO 部分。用机器人摄像头捕捉画面，传到本机后做动作模仿。",
    images: ["/works/jaka-pi.jpg", "/works/jaka-pi-02.jpg"],
    imageAlt: "节卡 JAKA π仔人形机器人",
  },
  {
    index: "02",
    title: "第二届世界人形机器人大赛",
    note: "赛事",
    detail:
      "用这台机器人参加消防救援和应急处突两个场景赛，分别取得前 10 名和前 17 名。",
    image: "/works/humanoid-games.jpg",
    imageAlt: "第二届世界人形机器人大赛现场",
  },
  {
    index: "03",
    title: "个人微信小程序开发",
    note: "微信小程序",
    detail: "微信点餐小程序「TT点菜」。可以堂食点餐，也可以打包自提。",
    image: "/works/tt-order.jpg",
    imageAlt: "TT点菜微信小程序首页",
  },
  {
    index: "04",
    title: "声光立牌商业项目",
    note: "商业项目",
    detail: "声光立牌商业项目。可发光底座与人物立牌组合展示。",
    images: [
      "/works/standee-01.jpg",
      "/works/standee-02.jpg",
      "/works/standee-03.jpg",
      "/works/standee-04.jpg",
    ],
    imageAlt: "声光立牌成品",
  },
  {
    index: "05",
    title: "Mirco Duck 机器鸭商业项目",
    note: "商业项目",
    detail: "机器鸭商业项目。实物样机与桌面调试现场。",
    images: [
      "/works/micro-duck-01.png",
      "/works/micro-duck-02.jpg",
      "/works/micro-duck-03.jpg",
      "/works/micro-duck-04.jpg",
    ],
    imageAlt: "Mirco Duck 机器鸭",
  },
  {
    index: "06",
    title: "面向 OPC 的代账 AI Agent",
    note: "月末与季末记账",
    detail:
      "面向 OPC 设计的代账 AI Agent，帮助处理月末与季末的记账工作，旨在减少记账所需的时间与成本。",
    role: "与朋友一起完成。目前项目仍在开发中，正在封装与测试。",
    tags: ["AI Agent", "Agent 框架", "封装与调试中"],
  },
];

function galleryOf(work: Work) {
  if (work.images?.length) return work.images;
  if (work.image) return [work.image];
  return [];
}

export default function App() {
  const [open, setOpen] = useState<Work | null>(null);
  const [slide, setSlide] = useState(0);

  const gallery = open ? galleryOf(open) : [];

  useEffect(() => {
    if (!open) return;
    setSlide(0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowLeft") {
        setSlide((current) => Math.max(0, current - 1));
      }
      if (event.key === "ArrowRight") {
        setSlide((current) => {
          const last = Math.max(0, galleryOf(open).length - 1);
          return Math.min(last, current + 1);
        });
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div id="top" className="relative text-cream">
      <Starfield />

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10">
        <a href="#top" className="text-sm tracking-[0.22em]">
          Mohan Tong
        </a>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#works" className="transition-opacity duration-300 hover:opacity-60">
            作品
          </a>
          <a href="#about" className="transition-opacity duration-300 hover:opacity-60">
            关于
          </a>
        </nav>
      </header>

      <section className="relative z-10 flex h-[100dvh] items-center justify-center px-6">
        <h1 className="anim-fade-in text-center text-5xl leading-tight tracking-wide sm:text-7xl">
          Mohan Tong
        </h1>
        <a
          href="#works"
          className="absolute bottom-8 text-xs tracking-[0.35em] text-cream/70 transition-opacity duration-300 hover:opacity-60"
        >
          作品
        </a>
      </section>

      <main id="works" className="relative z-10 mx-auto max-w-3xl px-6 pb-8 pt-24 sm:px-10">
        {works.map((work) => (
          <article
            key={work.index}
            className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-cream/15 py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-x-8 sm:py-8"
          >
            <p className="pt-1 text-xs tracking-[0.18em] text-cream/50">{work.index}</p>
            <div>
              <h2 className="text-xl leading-snug sm:text-2xl">
                <button
                  type="button"
                  className="text-left transition-opacity duration-300 hover:opacity-60"
                  onClick={() => setOpen(work)}
                >
                  {work.title}
                </button>
              </h2>
              <p className="mt-2 text-sm text-cream/60">{work.note}</p>
            </div>
          </article>
        ))}
      </main>

      <section id="about" className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
        <p className="text-xs tracking-[0.28em] text-cream/50">关于</p>
        <h2 className="mt-4 text-3xl sm:text-4xl">童墨晗</h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/75 sm:text-base">
          这一页收录六件作品，包括机器人开发、赛事、微信小程序、商业项目和协作项目。
        </p>
      </section>

      <footer className="relative z-10 flex items-end justify-between gap-6 border-t border-cream/15 px-6 py-8 text-sm sm:px-10">
        <div>
          <p>童墨晗</p>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-cream/60 transition-opacity duration-300 hover:opacity-60"
          >
            粤ICP备2026163835号-2
          </a>
        </div>
        <a href="#top" className="shrink-0 transition-opacity duration-300 hover:opacity-60">
          返回顶部
        </a>
      </footer>

      {open ? (
        <div
          className="anim-dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onClick={() => setOpen(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-dialog-title"
            className="anim-dialog-panel relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl border border-cream/20 bg-black p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="关闭"
              className="absolute right-4 top-4 text-lg leading-none text-cream/70 transition-opacity duration-300 hover:opacity-60"
              onClick={() => setOpen(null)}
            >
              ×
            </button>
            <p className="text-xs tracking-[0.18em] text-cream/50">作品 / {open.note}</p>
            <h2 id="work-dialog-title" className="mt-4 pr-8 text-2xl leading-snug sm:text-3xl">
              {open.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/80">
              {open.detail ?? open.note}
            </p>
            {open.tags ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {open.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-cream/20 px-3 py-1 text-xs text-cream/70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            {gallery.length > 0 ? (
              <div className="mt-5">
                <div className="relative">
                  <img
                    key={gallery[slide]}
                    src={gallery[slide]}
                    alt={
                      gallery.length > 1
                        ? `${open.imageAlt ?? open.title} ${slide + 1}/${gallery.length}`
                        : (open.imageAlt ?? "")
                    }
                    className="max-h-80 w-full rounded-xl object-contain"
                  />
                  {gallery.length > 1 ? (
                    <>
                      <button
                        type="button"
                        aria-label="上一张"
                        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-black/55 text-2xl leading-none text-cream transition-opacity duration-300 hover:opacity-80 disabled:opacity-25 sm:left-3 sm:h-11 sm:w-11"
                        disabled={slide === 0}
                        onClick={() => setSlide((current) => Math.max(0, current - 1))}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        aria-label="下一张"
                        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-black/55 text-2xl leading-none text-cream transition-opacity duration-300 hover:opacity-80 disabled:opacity-25 sm:right-3 sm:h-11 sm:w-11"
                        disabled={slide >= gallery.length - 1}
                        onClick={() =>
                          setSlide((current) => Math.min(gallery.length - 1, current + 1))
                        }
                      >
                        ›
                      </button>
                    </>
                  ) : null}
                </div>
                {gallery.length > 1 ? (
                  <p className="mt-3 text-center text-sm text-cream/60">
                    {slide + 1}/{gallery.length}
                  </p>
                ) : null}
              </div>
            ) : null}
            {open.role ? (
              <div className="mt-6">
                <p className="text-sm">项目与个人职责</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{open.role}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
