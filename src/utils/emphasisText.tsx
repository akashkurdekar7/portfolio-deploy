import { Fragment, type ReactNode } from "react";

// Shared "**phrase**" markup convention: the wrapped phrase renders in black
// as the "main thing", everything else renders grey. Split down to
// individual words (rather than whole phrases) so each word can also be an
// animation target for scroll-scrubbed reveals.
interface EmphasisWord {
  text: string;
  black?: boolean;
}

const parseEmphasisWords = (text: string): EmphasisWord[] =>
  text.split(/(\*\*.+?\*\*)/g).flatMap((chunk) => {
    const black = chunk.startsWith("**") && chunk.endsWith("**");
    const clean = black ? chunk.slice(2, -2) : chunk;
    return clean
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ text: word, black }));
  });

export const renderEmphasisText = (text: string, wordClassName = "emphasis-word"): ReactNode =>
  parseEmphasisWords(text).map((word, index) => (
    <Fragment key={index}>
      <span className={`${wordClassName} inline-block ${word.black ? "text-black" : "text-grey"}`}>{word.text}</span>{" "}
    </Fragment>
  ));

// For places that want the plain sentence without the black/grey split —
// strips the "**...**" markers instead of rendering them as emphasis.
export const stripEmphasisMarkup = (text: string): string => text.replace(/\*\*(.+?)\*\*/g, "$1");
