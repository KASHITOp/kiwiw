import KiwiSlice from "./KiwiSlice";

// The Kiwiw mark: a tiny, real kiwi slice (same geometry as the hero).
export default function KiwiLogo({ size = 28 }: { size?: number }) {
  return <KiwiSlice R={15} detail={0.35} pad={2} style={{ width: size, height: size, display: "block", flex: "none" }} />;
}
