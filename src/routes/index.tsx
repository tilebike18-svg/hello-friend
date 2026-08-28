import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, Copy, ExternalLink, Heart } from "lucide-react";
import { DevToIcon, DocsIcon, GithubIcon, PdfIcon } from "@/components/doc-icons";

const LOGO = "/dao-logo-on-dark.png";
const REPO = "https://github.com/0xDarkSeidBull/dao-redbelly";
const PDF =
  "https://cdn.jsdelivr.net/gh/0xDarkSeidBull/daotask16@main/rbnt_recovery.pdf";
const DOCX =
  "https://docs.google.com/viewer?url=https%3A%2F%2Fraw.githubusercontent.com%2F0xDarkSeidBull%2Fdaotask16%2Fmain%2Frbnt_recovery.docx&embedded=false";
const ARTICLE =
  "https://dev.to/0xdarkseidbull/unstick-your-rbnt-building-a-recovery-playbook-nobody-wants-to-need-3aka";
const GITHUB_REPO = "https://github.com/0xDarkSeidBull/daotask16/";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unstick Your RBNT: Cross Chain Recovery Playbook" },
      {
        name: "description",
        content:
          "Recovery guide for stuck RBNT across Ethereum, Base, Solana and Redbelly Network: verified contracts, bridge routes, liquidity data and exchange recovery paths.",
      },
      { property: "og:title", content: "Unstick Your RBNT: Cross Chain Recovery Playbook" },
      {
        property: "og:description",
        content:
          "Redbelly DAO community support guide. Verified contract addresses, swap liquidity, bridge routes and step by step fixes for stuck RBNT.",
      },
    ],
  }),
  component: Playbook,
});

const NAV = [
  { id: "s1", n: "1", label: "Before You Bridge" },
  { id: "s2", n: "2", label: "Reference Tables" },
  { id: "s3", n: "3", label: "Zero Value Swap" },
  { id: "s4", n: "4", label: "Quote Unavailable" },
  { id: "s5", n: "5", label: "Stranded Stablecoins" },
  { id: "s6", n: "6", label: "Wrong CEX Deposit" },
];

/* ---------- primitives ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[8px] border border-[#3a4650] bg-[#1e2a31] p-6 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Warning({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[8px]">
      <div className="bg-[#EF5350] px-6 py-5 sm:px-7">
        <p className="font-mono text-[12px] font-bold tracking-[0.1em] text-white uppercase">
          Warning . Read First
        </p>
        {title ? (
          <h3 className="mt-3 text-[26px] leading-[1.2] font-bold text-white sm:text-[30px]">
            {title}
          </h3>
        ) : null}
      </div>
      <div className="bg-[#ffdad7] px-6 py-5 text-[16px] leading-[1.5] font-semibold text-[#16202A] sm:px-7">
        {children}
      </div>
    </div>
  );
}


function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <p className="font-mono text-[12px] font-bold tracking-[0.1em] text-[#ffb3ae] uppercase">
        Section {n}
      </p>
      <h2 className="mt-3 text-[26px] leading-[1.15] font-semibold tracking-[-0.01em] text-[#e4ebf0] sm:text-[32px]">
        {title}
      </h2>
      <div className="mt-8 space-y-8">{children}</div>
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[20px] leading-[1.25] font-semibold tracking-[-0.01em] text-[#e4ebf0] sm:text-[22px]">
      {children}
    </h3>
  );
}

function P({ children, lead = false }: { children: React.ReactNode; lead?: boolean }) {
  return (
    <p
      className={
        lead
          ? "text-[18px] leading-[1.55] text-[#b8c4cc]"
          : "text-[16px] leading-[1.5] text-[#b8c4cc]"
      }
    >
      {children}
    </p>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#ffb3ae] underline underline-offset-4 hover:opacity-80"
    >
      {children}
    </a>
  );
}

type SourceSeg = { text: string } | { label: string; href: string };

function SourceCell({ segs }: { segs: SourceSeg[] }) {
  return (
    <>
      {segs.map((seg, i) =>
        "text" in seg ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <A key={i} href={seg.href}>
            {seg.label}
          </A>
        ),
      )}
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="bg-[#1b252a] px-4 py-3 text-left font-sans text-[12px] font-bold tracking-[0.1em] text-[#93a4ae] uppercase">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={`border-t border-[#27323a] px-4 py-3 align-top text-[16px] text-[#b8c4cc] ${className}`}
    >
      {children}
    </td>
  );
}

function TablePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-[#3a4650] bg-[#1e2a31]">
      <table className="w-full min-w-[560px] border-collapse">{children}</table>
    </div>
  );
}

function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const short = value.length > 22 ? `${value.slice(0, 10)}...${value.slice(-8)}` : value;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-[14px] text-[#e4ebf0]" title={value}>
        {short}
      </span>
      <button
        type="button"
        aria-label={`Copy ${value}`}
        onClick={() => {
          void navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded p-1 text-[#93a4ae] transition-colors hover:text-[#ffb3ae]"
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </span>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="border-t border-[#27323a] pt-5 first:border-t-0 first:pt-0">
      <p className="text-[18px] font-semibold text-[#e4ebf0]">
        <span className="font-mono text-[#ffb3ae]">{n}.</span> {title}
      </p>
      <div className="mt-2 space-y-3 text-[16px] leading-[1.5] text-[#b8c4cc]">{children}</div>
    </li>
  );
}

/* ---------- data ---------- */

const ETH = "0xb45ffb51984d626ee758b336c61cf20990c6bf13";
const BASE = "0x020940df9F5E77338a094D55b5B5914122a804A5";
const SOL = "AKbyFYEgueHwS7V4S3gXsWpGJZvv3f7WMkRMFdrenSG1";
const RBN = "0x6ed1F491e2d31536D6561f6bdB2AdC8F092a6076";

const DISCORD_ANNOUNCE =
  "https://discord.com/channels/969088176322908160/969088176515854341/1508738455767879711";
const DISCORD_SUPPORT =
  "https://discord.com/channels/969088176322908160/969088176515854341";
const VINE_LAYERZERO = "https://vine.redbelly.network/bridged-tokens/layerzero";
const VINE_LUCID = "https://vine.redbelly.network/bridged-tokens/lucidlabs";

const GATE =
  "https://www.gate.com/help/guide/deposit_withdrawa/26321/how-to-submit-a-retri_-application";
const MEXC =
  "https://www.mexc.com/support/article/what-is-the-uncredited-deposit-return-application-17827791526274";
const BYDFI =
  "https://support.bydfi.com/hc/en-us/articles/5698786544143-Deposits-Haven-t-Been-Credited-to-Your-BYDFi-Account";
const WHITEBIT = "https://help.whitebit.com/hc/en/requests/new";

const EXCHANGES = [
  {
    name: "GATE",
    body: "Self service recovery form available. You submit the request yourself without waiting for a support agent.",
    href: GATE,
  },
  {
    name: "MEXC",
    body: "Self service recovery form available. MEXC charges a processing fee for wrong deposit returns.",
    href: MEXC,
  },
  {
    name: "BYDFI",
    body: "No self service form. Recovery is handled through support, and you must supply the transaction hash and your account ID.",
    href: BYDFI,
  },
  {
    name: "WHITEBIT",
    body: "Weakest documented process of the four. No dedicated recovery form, and WhiteBIT states that deposits made incorrectly may be irreversibly lost.",
    href: WHITEBIT,
  },
];

const CONTRACT_ROWS: {
  chain: string;
  address: string;
  level: "High" | "Medium" | "Absent";
  source: SourceSeg[];
}[] = [
  {
    chain: "Ethereum",
    address: ETH,
    level: "High",
    source: [
      { label: "Redbelly Network on X", href: "https://x.com/RedbellyNetwork/status/1890340030197166112" },
    ],
  },
  {
    chain: "Solana",
    address: SOL,
    level: "High",
    source: [
      { text: "Redbelly team, " },
      { label: "official Discord announcement", href: DISCORD_ANNOUNCE },
      { text: ", 26 May 2026 - also listed on " },
      { label: "Vine", href: VINE_LAYERZERO },
    ],
  },
  {
    chain: "Redbelly Network (native)",
    address: RBN,
    level: "High",
    source: [
      { label: "How To Claim Your RBNT Rewards (Medium)", href: "https://medium.com/@redbellyblockchain" },
    ],
  },
  {
    chain: "Base",
    address: BASE,
    level: "Medium",
    source: [{ label: "Lucid Labs bridged tokens on Vine", href: VINE_LUCID }],
  },
  {
    chain: "BNB Chain",
    address: "No official token exists",
    level: "Absent",
    source: [
      { text: "Confirmed absent. Redbelly team, " },
      { label: "official Discord support channel", href: DISCORD_SUPPORT },
      { text: ', 2 Nov 2025: "We never had rbnt on bsc. All RBNT on bsc is fake." Multiple impersonator tokens circulate, none affiliated with Redbelly.' },
    ],
  },
];

const LIQUIDITY: { chain: string; intro: string; rows: [string, string][]; flag?: string; pool?: string }[] = [
  {
    chain: "Ethereum",
    intro:
      "Ethereum holds the deepest pool of the three. Mid size swaps clear at a workable cost, while very large orders still move the price sharply.",
    rows: [
      ["100,000 WRBNT", "1.51% to 2.87%"],
      ["1,000,000 WRBNT", "13% to 14%"],
    ],
  },
  {
    chain: "Solana",
    intro:
      "Solana liquidity is extremely thin. Even a modest order size returns an impact figure that makes the swap uneconomic.",
    pool:
      "Current trading pool: wSOL/RBNT on Raydium - 9oTcYnRPsSVaZFk6n85ADjQRKc9m8h1bZPycXv6gPBkR",
    rows: [["10,000 WRBNT", "86.77%"]],
    flag: "86.77%",
  },
  {
    chain: "Base",
    intro:
      "Base sits between the two. Larger orders can price better than smaller ones here because routing depends on which pools are available at the time.",
    rows: [
      ["1,000,000 RBNT", "7.88% to 8.04%"],
      ["100,000 RBNT", "13.36%"],
    ],
  },
];

const BRIDGE_ROUTES: {
  source: string;
  asset: string;
  route: string;
  fee: string;
  time: string;
  warn?: boolean;
}[] = [
  { source: "Ethereum", asset: "RBNT", route: "Stargate via Lucid Labs Bridge", fee: "0.00013 ETH (~$0.31)", time: "~4 min" },
  { source: "Ethereum", asset: "WRBNT", route: "Polymer via Lucid Labs Bridge", fee: "0.000015 ETH + 10 WRBNT fee", time: "~2 min" },
  { source: "Base", asset: "RBNT", route: "Stargate via Lucid Labs Bridge", fee: "0.00013 ETH (~$0.32)", time: "~1 min" },
  { source: "Base", asset: "WRBNT", route: "Polymer via Lucid Labs Bridge", fee: "0.000015 ETH + 10 WRBNT fee", time: "~10 sec" },
  { source: "BSC", asset: "RBNT", route: "Stargate via Lucid Labs Bridge", fee: "0.00044 BNB (~$0.31)", time: "~124 min" },
  { source: "Arbitrum", asset: "RBNT", route: "Stargate via Lucid Labs Bridge", fee: "0.00013 ETH (~$0.31)", time: "~172 min" },
  { source: "Polygon", asset: "RBNT", route: "Stargate via Lucid Labs Bridge", fee: "3.02 POL (~$0.32)", time: "~176 min" },
  { source: "Avalanche", asset: "RBNT", route: "Stargate via Lucid Labs Bridge", fee: "0.04 AVAX (~$0.32)", time: "~61 min" },
  { source: "Sonic", asset: "RBNT", route: "Stargate via Lucid Labs Bridge", fee: "10.62 S (~$0.31)", time: "~86 min" },
  {
    source: "Solana",
    asset: "RBNT",
    route: "No route on the single widget, two-hop route exists",
    fee: "N/A",
    time: "N/A",
    warn: true,
  },
];

const CEX_WRITEUPS = [
  {
    name: "GATE",
    href: "https://www.gate.com/help",
    body: "The tool is called Token Recovery. Screen order: Recent Deposits → find the TXID → confirm the address belongs to Gate → open Token Recovery → check if your chain is listed → Apply for Recovery. Flat 20 USDT fee from your Spot balance, charged whether or not it succeeds.",
  },
  {
    name: "MEXC",
    href: "https://www.mexc.com/support",
    body: "The tool is the Uncredited Deposit Return Application, under Wallets → Funding History. Fill in TXID, network, asset, amount, and a screenshot of the deposit source. Funds are returned to your original sending address, not credited as a tradable MEXC balance. Review takes 1-2 business days.",
  },
  {
    name: "BYDFI",
    href: "https://bydfi.com/en/support",
    body: "No form - everything goes through Customer Support. Screen order: profile icon → note your UID → search bar → look up your TXID or address → copy the TxHash → open a support ticket with TxHash, UID, token, and amount. No fee stated.",
  },
  {
    name: "WHITEBIT",
    href: "https://help.whitebit.com",
    body: "No dedicated tool. Contact support directly: email support@whitebit.com, live chat (bottom-right on whitebit.com), or a ticket through their Help Center. Provide TXID, network, asset, and account details.",
  },
];

/* ---------- page ---------- */

function Playbook() {
  return (
    <div className="min-h-screen bg-[#0f181d]">
      <header className="sticky top-0 z-50 border-b border-[#27323a] bg-[#121b20]/95 backdrop-blur">
        <div className="flex items-center justify-between py-3 pl-1 pr-1 sm:pl-2 sm:pr-2">
          <a href="#top" className="flex shrink-0 items-center" aria-label="Back to top">
            <img
              src={LOGO}
              alt="Redbelly DAO logo"
              width={78}
              height={40}
              className="block h-10 w-auto shrink-0"
            />
          </a>
          <Link
            to="/proof"
            className="inline-flex items-center rounded-[6px] border border-[#EF5350] bg-[#EF5350] px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#d8413e]"
          >
            Proof
          </Link>
        </div>
        <nav className="pl-1 pb-3 sm:pl-2">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-[#b8c4cc]">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="border-b border-transparent py-1 transition-colors hover:border-b-[#ffb3ae] hover:text-[#ffb3ae]"
                >
                  {item.n}. {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top" className="mx-auto w-[88%] max-w-[1500px] pb-24">
        {/* HERO */}
        <section className="bg-[#121b20]/0 py-16 sm:py-20">
          <p className="font-sans text-[12px] font-bold tracking-[0.1em] text-[#93a4ae] uppercase">
            Redbelly DAO . Community Support Guide
          </p>
          <h1 className="mt-4 text-[38px] leading-[1.05] font-bold tracking-[-0.02em] text-[#e4ebf0] sm:text-[48px]">
            Unstick Your RBNT
          </h1>
          <p className="mt-3 text-[26px] leading-[1.2] font-semibold tracking-[-0.01em] text-[#b8c4cc] sm:text-[32px]">
            A Cross Chain Recovery Playbook
          </p>
          <div className="mt-6">
            <P lead>
              This playbook covers the situations that strand RBNT in practice: tokens sent to the
              wrong network, bridge transfers that never arrive or never quote, and swaps that fail
              because the pool on that chain is too thin to absorb the order. Each section names the
              cause, then gives the recovery path that actually applies.
            </P>
          </div>
          <div className="mt-8">
            <Warning>
              Contract deployments, bridge routes and pool depth all change over time. Verify every
              address and quote against the live source before acting on an amount that matters to
              you.
            </Warning>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#EF5350] px-5 py-2.5 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Read PDF
            </a>
            <a
              href={DOCX}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#EF5350] px-5 py-2.5 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Read Docs
            </a>
            <a
              href={ARTICLE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#EF5350] px-5 py-2.5 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Read Article
            </a>
          </div>

        </section>

        {/* DOCUMENT PREVIEW */}
        <section className="pb-16">
          <Sub>Full document, rendered inline</Sub>
          <div className="mt-5 rounded-[8px] border border-[#3a4650] bg-[#1e2a31] p-3 sm:p-4">
            <iframe
              src={PDF}
              title="Unstick Your RBNT Recovery Playbook, full PDF"
              className="h-[70vh] min-h-[520px] w-full rounded-[4px] border-0 bg-[#0a1216]"
            />
          </div>
        </section>

        <div className="space-y-20">
          {/* SECTION 01 */}
          <Section id="s1" n="01" title="Before You Bridge">
            <P lead>
              Most unrecoverable losses start before any bridge is involved. Sending RBNT to an
              address on a network the receiving side does not support puts the funds outside the
              reach of any tool on this page, so the network check is the one step worth slowing
              down for.
            </P>

            <div className="space-y-6">
              <Sub>Where RBNT trades</Sub>
              <P>
                RBNT trades on four exchanges, and their recovery processes are not equivalent. The
                exchange you used determines your realistic options.
              </P>
              <div className="grid gap-5 md:grid-cols-2">
                {EXCHANGES.map((ex) => {
                  const isHighlight = ["GATE", "MEXC", "BYDFI", "WHITEBIT"].includes(ex.name);
                  return (
                    <div
                      key={ex.name}
                      className="overflow-hidden rounded-[8px] border border-[#3a4650] bg-[#1e2a31]"
                    >
                      <div className={isHighlight ? "bg-[#ffdad7] px-6 py-4" : "px-6 pt-6"}>
                        <h4
                          className={`text-[16px] leading-[1.5] font-semibold ${
                            isHighlight ? "text-[#16202A]" : "font-mono text-[14px] font-bold tracking-[0.1em] uppercase text-[#ffb3ae]"
                          }`}
                        >
                          {ex.name}
                        </h4>
                      </div>
                      <div className={isHighlight ? "px-6 pb-6 pt-4" : "px-6 pb-6"}>
                        <p className="text-[16px] leading-[1.5] text-[#b8c4cc]">{ex.body}</p>
                        <p className="mt-4 text-[16px]">
                          <A href={ex.href}>Recovery process</A>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card>
              <Sub>Correct deposit procedure</Sub>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] leading-[1.5] text-[#b8c4cc]">
                <li>Confirm the exchange actually lists RBNT before generating a deposit address.</li>
                <li>
                  Confirm the exact network the exchange lists for RBNT, and that it matches the
                  chain you are sending from.
                </li>
                <li>Send a small test amount first and wait for it to credit.</li>
                <li>
                  Keep the transaction hash, deposit address and timestamp as evidence in case
                  anything goes wrong.
                </li>
              </ol>
            </Card>

            <P>
              Never resend funds to an address that has already failed to credit, and never accept
              help through a direct message. Anyone offering to unstick a transfer for a fee or for
              your wallet credentials is running a scam, not a recovery service.
            </P>
          </Section>

          {/* SECTION 02 */}
          <Section id="s2" n="02" title="Reference Tables">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Sub>Table A. Wrapped RBNT Contract Addresses</Sub>
                <span className="inline-flex items-center gap-2 rounded-[4px] border border-[#3a4650] px-2.5 py-1">
                  <span className="h-2 w-2 rounded-full bg-[#86EFAC]" aria-hidden="true" />
                  <span className="font-mono text-[12px] font-bold tracking-[0.1em] text-[#ffb3ae] uppercase">
                    Verified
                  </span>
                </span>
              </div>
              <TablePanel>
                <thead>
                  <tr>
                    <Th>Chain</Th>
                    <Th>Contract Address</Th>
                    <Th>Confidence</Th>
                    <Th>Source</Th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRACT_ROWS.map((row) => (
                    <tr key={row.chain}>
                      <Td className="text-[#e4ebf0]">{row.chain}</Td>
                      <Td>
                        {row.level === "Absent" ? (
                          <span className="font-mono text-[14px] text-[#ffb3ae]">{row.address}</span>
                        ) : (
                          <CopyAddress value={row.address} />
                        )}
                      </Td>
                      <Td>
                        <span
                          className="font-mono text-[14px] font-bold"
                          style={{
                            color:
                              row.level === "High"
                                ? "#86EFAC"
                                : row.level === "Medium"
                                  ? "#FCD34D"
                                  : "#ffb3ae",
                          }}
                        >
                          {row.level === "Absent" ? "No token" : row.level}
                        </span>
                      </Td>
                      <Td><SourceCell segs={row.source} /></Td>
                    </tr>
                  ))}
                </tbody>
              </TablePanel>
            </div>

            <div className="space-y-8">
              <Sub>Table B. Current Swap Liquidity by Chain</Sub>
              {LIQUIDITY.map((g) => (
                <div key={g.chain} className="space-y-4">
                  <h4 className="text-[18px] font-semibold text-[#e4ebf0]">{g.chain}</h4>
                  <P>{g.intro}</P>
                  {g.pool ? (
                    <P>
                      <span className="font-mono text-[#e4ebf0]">{g.pool}</span>
                    </P>
                  ) : null}
                  <TablePanel>
                    <thead>
                      <tr>
                        <Th>Swap Size</Th>
                        <Th>Price Impact</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map(([size, impact]) => (
                        <tr key={size}>
                          <Td className="font-mono text-[#e4ebf0]">{size}</Td>
                          <Td
                            className={`font-mono ${g.flag === impact ? "text-[#ffb3ae]" : "text-[#e4ebf0]"}`}
                          >
                            {impact}
                            {g.flag === impact ? " (effectively unusable)" : ""}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </TablePanel>
                </div>
              ))}
            </div>
          </Section>

          {/* SECTION 03 */}
          <Section id="s3" n="03" title="Failure Mode 1, Wrapped RBNT Zero Value or Swap Fail">
            <Card>
              <ol className="space-y-5">
                <Step n={1} title="Confirm the contract address">
                  <p>
                    Compare the token contract in your wallet against Table A, character by
                    character. A wrapped token showing zero value is very often the wrong contract
                    rather than a broken one. On BNB Chain there is no official token at all -
                    Redbelly's own team confirmed this directly in their{" "}
                    <A href={DISCORD_SUPPORT}>Discord support channel</A>: "We never had rbnt on bsc.
                    All RBNT on bsc is fake." Any RBNT-looking asset there is an impersonator with no
                    recoverable value.
                  </p>
                  <p className="text-[15px] font-bold underline text-[#cfd8df]">
                    Redbelly team, official Discord, 2 Nov 2025 - 'We never had rbnt on bsc. All RBNT on
                    bsc is fake.'
                  </p>
                  <img
                    src="https://raw.githubusercontent.com/0xDarkSeidBull/daotask16/main/evidence/appie.jpg"
                    alt="Redbelly team Discord message confirming no RBNT exists on BNB Chain"
                    className="mt-2 w-full max-w-[600px] rounded-[8px] border border-[#3a4650]"
                    loading="lazy"
                  />
                </Step>
                <Step n={2} title="Check pool depth before swapping">
                  <p>
                    A large price impact warning is the pool being honest with you, not a bug. Table
                    B shows a 10,000 WRBNT swap on Solana quoting{" "}
                    <span className="font-mono text-[#ffb3ae]">86.77%</span> impact, which means the
                    pool cannot absorb your order. Reduce size, split the swap, or move to a chain
                    with deeper liquidity instead of raising slippage.
                  </p>
                </Step>
                <Step n={3} title="Rule out ordinary transaction issues">
                  <p>
                    If the contract matches Table A and the pool depth in Table B is adequate, the
                    cause is usually mundane: insufficient native gas, an expired quote, or slippage
                    set too tight. Refresh the quote, confirm your gas balance, and retry once with a
                    realistic slippage setting on{" "}
                    <A href={`https://1inch.com/swap?src=1:${ETH}&dst=1:USDT`}>1inch</A>.
                  </p>
                </Step>
              </ol>
            </Card>
          </Section>

          {/* SECTION 04 */}
          <Section
            id="s4"
            n="04"
            title="Failure Mode 2, Quote Unavailable Bridging RBNT Back to Redbelly Network"
          >
            <P lead>
              <A href="https://bridge.lucidlabs.fi/">Lucid Labs Bridge</A> is the official route back
              to Redbelly Network. When no quote appears, the usual cause is that your source chain
              is not on the supported list, which is a limitation of the route rather than a fault in
              your wallet.
            </P>

            <div className="space-y-4">
              <Sub>Verified Bridge Routes</Sub>
              <TablePanel>
                <thead>
                  <tr>
                    <Th>Source Chain</Th>
                    <Th>Asset</Th>
                    <Th>Route</Th>
                    <Th>Fee</Th>
                    <Th>Time</Th>
                  </tr>
                </thead>
                <tbody>
                  {BRIDGE_ROUTES.map((r) => (
                    <tr key={`${r.source}-${r.asset}`}>
                      <Td className={r.warn ? "text-[#ffb3ae]" : "text-[#e4ebf0]"}>
                        <span className="inline-flex items-center gap-2">
                          {r.warn && (
                            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          )}
                          {r.source}
                        </span>
                      </Td>
                      <Td className={`font-mono ${r.warn ? "text-[#ffb3ae]" : "text-[#e4ebf0]"}`}>
                        {r.asset}
                      </Td>
                      <Td className={r.warn ? "text-[#ffb3ae]" : ""}>{r.route}</Td>
                      <Td className={`font-mono ${r.warn ? "text-[#ffb3ae]" : ""}`}>{r.fee}</Td>
                      <Td className={`font-mono ${r.warn ? "text-[#ffb3ae]" : ""}`}>{r.time}</Td>
                    </tr>
                  ))}
                </tbody>
              </TablePanel>
              <P>
                Checked live against both Lucid Labs Bridge and Oku (oku.trade), a separate frontend
                for the same LayerZero route - fee and time matched closely on both.
              </P>
              <p className="text-[16px]">
                <A href="https://bridge.lucidlabs.fi/">Recovery process</A>
              </p>
            </div>

            <div className="space-y-6">
              <figure className="space-y-2">
                <figcaption className="text-[15px] font-bold underline text-[#cfd8df]">
                  Lucid Labs Bridge, pre-connect state
                </figcaption>
                <img
                  src="https://raw.githubusercontent.com/0xDarkSeidBull/daotask16/main/evidence/connect%20wallet.jpg"
                  alt="Lucid Labs Bridge pre-connect wallet screen"
                  className="w-full rounded-[8px] border border-[#3a4650]"
                  loading="lazy"
                />
              </figure>
              <figure className="space-y-2">
                <figcaption className="text-[15px] font-bold underline text-[#cfd8df]">
                  Wallet picker - EVM, Solana, and Tron wallets
                </figcaption>
                <img
                  src="https://raw.githubusercontent.com/0xDarkSeidBull/daotask16/main/evidence/choose_wallet.png"
                  alt="Wallet picker showing EVM, Solana, and Tron wallet options"
                  className="w-full rounded-[8px] border border-[#3a4650]"
                  loading="lazy"
                />
              </figure>
              <figure className="space-y-2">
                <figcaption className="text-[15px] font-bold underline text-[#cfd8df]">
                  Solana selected as source - no route found, confirms the two-hop limitation above
                </figcaption>
                <img
                  src="https://raw.githubusercontent.com/0xDarkSeidBull/daotask16/main/evidence/solana%20to%20redbelly.png"
                  alt="Solana selected as source chain with no route found to Redbelly"
                  className="w-full rounded-[8px] border border-[#3a4650]"
                  loading="lazy"
                />
              </figure>
              <figure className="space-y-2">
                <figcaption className="text-[15px] font-bold underline text-[#cfd8df]">
                  Oku (oku.trade), the cross-check tool, wallet connect screen
                </figcaption>
                <img
                  src="https://raw.githubusercontent.com/0xDarkSeidBull/daotask16/main/evidence2/wallet_connect.png"
                  alt="Oku trade wallet connect screen used as cross-check tool"
                  className="w-full rounded-[8px] border border-[#3a4650]"
                  loading="lazy"
                />
              </figure>
            </div>
            <p className="text-[16px]">
              Full evidence: all chains, both tools -{" "}
              <A href="https://github.com/0xDarkSeidBull/daotask16/tree/main/evidence">
                Lucid Labs screenshots
              </A>{" "}
              ·{" "}
              <A href="https://github.com/0xDarkSeidBull/daotask16/tree/main/evidence2">
                Oku screenshots
              </A>
            </p>

            <Card>
              <Sub>What to do</Sub>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] leading-[1.5] text-[#b8c4cc]">
                <li>
                  Check your source chain against the table above before assuming the bridge is
                  broken.
                </li>
                <li>
                  Redbelly's team confirmed directly (<A href={DISCORD_ANNOUNCE}>Discord</A>, 26 May
                  2026) there is no single-step bridge between Solana and Redbelly Network. The route
                  is two hops: bridge RBNT from Redbelly Network to an EVM chain like Ethereum or Base
                  via Lucid Labs Bridge or Oku, then use Stargate separately to bridge into Solana.
                  Same path in reverse to bring it back.
                </li>
                <li>
                  Do not repeatedly retry. Each attempt costs gas and returns the same result. Check{" "}
                  <A href="https://bridge.lucidlabs.fi/">Lucid Labs</A> directly for current chain
                  support, since chains can be added over time.
                </li>
                <li>
                  Never use an unofficial bridge as a workaround. An unsupported route is an
                  inconvenience, an unofficial bridge is a risk of total loss.
                </li>
              </ul>
            </Card>
          </Section>

          {/* SECTION 05 */}
          <Section id="s5" n="05" title="Failure Mode 3, Stablecoins Stranded on Ethereum Mainnet">
            <P lead>
              <A href="https://www.reddex.io/bridge">reddex</A> is the official interface for moving
              USDC and USDT into Redbelly Network, running on Lucid Labs and Polymer infrastructure.
              Treat any other interface offering the same transfer as unverified.
            </P>

            <div className="space-y-4">
              <Sub>Route and Fee</Sub>
              <TablePanel>
                <thead>
                  <tr>
                    <Th>Asset</Th>
                    <Th>Route</Th>
                    <Th>Fee</Th>
                  </tr>
                </thead>
                <tbody>
                  {["USDC", "USDT"].map((a) => (
                    <tr key={a}>
                      <Td className="font-mono text-[#e4ebf0]">{a}</Td>
                      <Td>Lucid Labs / Polymer</Td>
                      <Td className="font-mono text-[#e4ebf0]">1%</Td>
                    </tr>
                  ))}
                </tbody>
              </TablePanel>
            </div>

            <Card>
              <ol className="space-y-5">
                <Step n={1} title="Confirm the source transaction on Etherscan">
                  <p>
                    Confirm the transfer succeeded on Ethereum mainnet, with the correct token
                    contract, amount and destination. If the source transaction failed, nothing left
                    your wallet and there is nothing to recover.
                  </p>
                </Step>
                <Step n={2} title="Give it time">
                  <p>
                    Polymer transfers normally complete in ten seconds to a few minutes. Anything
                    past thirty minutes is a genuine delay worth investigating.
                  </p>
                </Step>
                <Step n={3} title="Check reddex directly for status">
                  <p>
                    Open <A href="https://www.reddex.io/bridge">reddex</A> and check transfer status
                    there rather than judging by your wallet balance alone.
                  </p>
                </Step>
                <Step n={4} title="If still stuck, collect evidence and contact support">
                  <p>Gather the following before opening a ticket:</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <span className="font-semibold text-[#ffb3ae]">Transaction hash</span> of the
                      source transfer
                    </li>
                    <li>
                      <span className="font-semibold text-[#ffb3ae]">Amount and asset</span> sent
                    </li>
                    <li>
                      <span className="font-semibold text-[#ffb3ae]">Timestamp</span> of the transfer
                    </li>
                    <li>
                      <span className="font-semibold text-[#ffb3ae]">Destination address</span> on
                      Redbelly Network
                    </li>
                  </ul>
                  <p>
                    Never resend the funds, and never click Discord or direct message links offering
                    to unstick the transfer for you.
                  </p>
                </Step>
              </ol>
            </Card>
          </Section>

          {/* SECTION 06 */}
          <Section
            id="s6"
            n="06"
            title="Failure Mode 4, Native RBNT Sent to a CEX Deposit Address by Mistake"
          >
            <P lead>
              Recovery is possible here, but never guaranteed. Each exchange runs a manual process
              with its own rules, fees and limits, and each reserves the right to decline. Your
              chances improve sharply when the evidence is complete on the first submission.
            </P>

            <Card>
              <Sub>Evidence to collect first</Sub>
              <ul className="mt-4 space-y-3 text-[16px] leading-[1.5] text-[#b8c4cc]">
                {[
                  "Transaction hash of the deposit",
                  "The exact deposit address you sent to",
                  "The exact asset and network used",
                  "Amount and timestamp",
                  "Your account identifier, UID or registered email",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border border-[#3a4650]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="space-y-6">
              {CEX_WRITEUPS.map((x) => (
                <div key={x.name}>
                  <h4 className="font-mono text-[16px] font-bold tracking-[0.08em] text-[#ffb3ae] uppercase">
                    {x.name}
                  </h4>
                  <p className="mt-2 text-[16px] leading-[1.5] text-[#b8c4cc]">{x.body}</p>
                  <p className="mt-2 text-[16px]">
                    <A href={x.href}>Recovery process</A>
                  </p>
                </div>
              ))}
            </div>

            <Warning>
              Never send additional funds to the same address, and never click links claiming to
              expedite recovery in exchange for a fee or your wallet credentials. No exchange will
              ever ask for a seed phrase or private key.
            </Warning>
          </Section>
        </div>
      </main>

      <footer className="border-t border-[#27323a] bg-[#0a1216] py-14">
        <div className="mx-auto w-[88%] max-w-[1500px]">
          <p className="text-[12px] font-bold tracking-[0.1em] text-[#93a4ae] uppercase">
            Research deliverable . Redbelly DAO
          </p>
          <p className="mt-4 text-[16px] leading-[1.5] text-[#93a4ae] italic">
            This guide reflects live, independently verified data at the time of publication. Always
            confirm current addresses, routes and quotes before acting on amounts that matter to you.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {[
              { href: PDF, label: "Read the PDF", Icon: PdfIcon },
              { href: DOCX, label: "Read the DOCX", Icon: DocsIcon },
              { href: ARTICLE, label: "Read the dev.to article", Icon: DevToIcon },
              { href: GITHUB_REPO, label: "View the GitHub repository", Icon: GithubIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-[#93a4ae] transition-colors hover:text-[#EF5350]"
              >
                <Icon className="h-8 w-8" aria-hidden="true" />
              </a>
            ))}
          </div>

        </div>
      </footer>
    </div>
  );
}
