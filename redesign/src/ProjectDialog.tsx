import { useEffect, useRef, useState } from 'react';
import type { Work } from './works';

function ControlIcon({ kind }: { kind: 'close' | 'previous' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={kind === 'close' ? 'M7 7l10 10M17 7L7 17' : kind === 'previous' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  );
}

function GalleryVideo({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    return () => { video?.pause(); };
  }, []);
  return (
    <video ref={ref} src={src} controls playsInline preload="metadata" aria-label={caption}>
      当前浏览器无法播放视频，<a href={src} target="_blank" rel="noreferrer">打开原视频</a>。
    </video>
  );
}

export default function ProjectDialog({ work, onClose }: { work: Work; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [slide, setSlide] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const length = work.images.length + (work.video ? 1 : 0);
  const caption = work.captions[slide] ?? work.video?.caption;
  const next = () => setSlide(s => Math.min(length - 1, s + 1));
  const prev = () => setSlide(s => Math.max(0, s - 1));

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const dialog = ref.current;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    // Preload only adjacent images rather than the whole gallery.
    [slide - 1, slide + 1].forEach(index => {
      if (work.images[index]) new Image().src = work.images[index];
    });
  }, [slide, work.images]);

  return (
    <dialog
      ref={ref}
      className={`project-dialog ${expanded ? 'expanded' : ''} ${work.contributionImage ? 'has-evidence' : ''}`}
      aria-label={work.title}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => {
        // Leave seeking/volume keyboard shortcuts to the native video player.
        if (length < 2 || event.target instanceof HTMLVideoElement) return;
        if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
      }}
    >
      <div className="dialog-toolbar">
        <span className="dialog-context">{work.category}</span>
        <button type="button" className="close-button" onClick={onClose} aria-label="关闭项目介绍" autoFocus>
          <ControlIcon kind="close" />
        </button>
      </div>
      <div className="dialog-inner">
        <div className="dialog-media">
          {length ? <>
            <div
              className={`image-stage ${length > 1 ? 'has-gallery' : ''}`}
              onTouchStart={event => {
                if (event.target instanceof HTMLVideoElement) {
                  touchStart.current = null;
                  return;
                }
                const { clientX: x, clientY: y } = event.touches[0];
                touchStart.current = { x, y };
              }}
              onTouchCancel={() => { touchStart.current = null; }}
              onTouchEnd={event => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start || length < 2) return;
                const dx = event.changedTouches[0].clientX - start.x;
                const dy = event.changedTouches[0].clientY - start.y;
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                  if (dx > 0) prev(); else next();
                }
              }}
            >
              {slide < work.images.length ?
                <img key={work.images[slide]} src={work.images[slide]} alt={work.captions[slide]} width="1000" height="1000" /> :
                work.video && <GalleryVideo {...work.video} />}
              {length > 1 && <>
                <button type="button" className="gallery-arrow previous" aria-label={work.video ? '上一项内容' : '上一张图片'} onClick={prev} disabled={slide === 0}>
                  <ControlIcon kind="previous" />
                </button>
                <button type="button" className="gallery-arrow next" aria-label={work.video ? '下一项内容' : '下一张图片'} onClick={next} disabled={slide === length - 1}>
                  <ControlIcon kind="next" />
                </button>
              </>}
            </div>
            <div className="gallery-caption" aria-live="polite" aria-atomic="true">
              <span>{caption}</span><span className="gallery-count">{slide + 1} / {length}</span>
            </div>
            <button type="button" className="image-expand" aria-pressed={expanded} onClick={() => setExpanded(value => !value)}>
              {expanded ? '恢复图文视图' : work.video ? '放大查看' : '放大图片'}
            </button>
          </> : <div className="agent-diagram"><span>OPC</span><div className="diagram-line" /><span>AI Agent</span><p>月末与季末记账</p><small>封装与测试中</small></div>}
        </div>
        <div className="dialog-copy">
          <h2>{work.title}</h2>
          <p className="dialog-intro">{work.description}</p>
          <div className="case-section">
            <h3>我的参与</h3>
            <p>{work.contribution}</p>
            {work.contributionImage && <figure className="contribution-evidence">
              <a href={work.contributionImage.src} target="_blank" rel="noreferrer" aria-label="在新标签页查看完整交易截图">
                <img src={work.contributionImage.src} alt={work.contributionImage.alt} width="1080" height="2344" loading="lazy" />
                <span>查看完整截图 <span aria-hidden="true">↗</span></span>
              </a>
              <figcaption>{work.contributionImage.caption}</figcaption>
            </figure>}
          </div>
          <div className="case-section"><h3>成果与进展</h3><p>{work.result}</p></div>
        </div>
      </div>
    </dialog>
  );
}
