import "./vault-media.css";
import Image from "next/image";

export function SignalVaultMedia() {
  return (
    <figure className="signal-vault-media">
      <div className="signal-vault-media__frame">
        <Image
          src="/images/projects/signal-vault.png"
          alt="Obsidian vault with Signal-synced notes: folder of curated articles and one note open"
          width={1200}
          height={750}
          className="signal-vault-media__img"
        />
      </div>
      <figcaption className="signal-vault-media__caption">
        Keepers land in the vault, as notes you might actually revisit.
      </figcaption>
    </figure>
  );
}
