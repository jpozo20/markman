/**
 * Recursively counts all bookmarks (nodes with a URL or title) within a given BookmarkTreeNode.
 * @param {chrome.bookmarks.BookmarkTreeNode[]} bookmarkNodes - Array of bookmark nodes (usually the root of a tree)
 * @returns {number} The total count of bookmarks.
 */
export function countBookmarksRecursively(bookmarkNodes) {
    let count = 0;

    for (const node of bookmarkNodes) {

        // Count each node, since folders are also bookmark items
        count++;
        
        // If the node has 'children', it is a folder, so recurse into it.
        if (node.children) {
            count += countBookmarksRecursively(node.children);
        }
    }
    return count;
}