import pkg from '@/../package.json';

const { name, version, homepage } = pkg;
const versionUrl = `${homepage}/releases/tag/v${version}`;

export const Footer = () => {
    return (
        <footer className="border-slate-800/50">
            <div className="mt-3 mb-3 border-slate-800/50 text-center text-slate-500 text-sm">
                <a href={versionUrl} className="underline" target="_blank" rel="noopener noreferrer">
                    {name} v{version}
                </a>
            </div>
        </footer>
    );
};
