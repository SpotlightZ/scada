import manifest from "../../elements/manifest.json";


export const loadAllElements = async () => {
    for(const pkg of manifest.packages) {
        await import(`../../elements/${pkg.path}`);
    }
}

