import { existsSync, readFileSync } from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";

export function convertFrontmatter(outputPath?: string) {
  return function _convertFrontmatter(inputContent: string) {
    const { data, content } = matter(inputContent);
    const dataCloned = { ...data };

    // Remove unnecessary fields
    delete dataCloned.emoji;
    delete dataCloned.type;

    // Convert published to private (reversed)
    dataCloned.private = !dataCloned.published;
    delete dataCloned.published;

    // Convert topics to tags
    dataCloned.tags = dataCloned.topics;
    delete dataCloned.topics;

    // Add slide: false
    dataCloned.slide = false;

    // Add new fields
    if (outputPath && existsSync(outputPath)) {
      const existingData = matter(readFileSync(outputPath, "utf8")).data;
      dataCloned.updated_at = existingData.updated_at || null;
      dataCloned.id = existingData.id || null;
      dataCloned.organization_url_name =
        existingData.organization_url_name || null;
    } else {
      dataCloned.updated_at = null;
      dataCloned.id = null;
      dataCloned.organization_url_name = null;
    }

    const updatedContent = content.replace(
      /!\[\]\((.*?) =(\d+)x\)/g,
      (match, src, width) => {
        return `<img width="${width}" src="${src}">`;
      }
    );

    console.log(updatedContent);

    const frontmatter = yaml.dump(dataCloned);
    return `---\n${frontmatter}---\n${updatedContent}`;
  };
}
