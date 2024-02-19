import { BookmarkItem } from "../../models/BookmarkTypes";

class CharNode {
    public key;
    public children: Map<string, CharNode>;
    public endOfWord: boolean;

    constructor(key) {
        this.key = key;
        this.children = new Map();
        this.endOfWord = false;
    }
}

class WordNode {
    public key;
    public matches: Map<string, BookmarkItem>;

    constructor(key) {
        this.key = key;
        this.matches = new Map();
    }
}

class SearchTrie {
    protected root: CharNode;
    protected children: Map<string, CharNode>;
    protected words: Map<string, WordNode>;
    protected trieSize: number;

    constructor() {
        this.root = new CharNode(null);
        this.children = new Map();
        this.words = new Map();
        this.trieSize = 0;
    }

    public getTrieSize() { return this.trieSize; }
    public getWordsIndexSize() { return this.words.size; }

    public indexBookmarkTitle(bookmark: BookmarkItem) {

        const lowerTitle = bookmark.name.toLowerCase();

        for (const word of lowerTitle.split(" ")) {
            const cleanWord = this.cleanWord(word);

            if (cleanWord.length < 3) continue;
            let node = this.words.get(cleanWord);

            // If the word doesn't exist in the Trie, create a WordNode for it
            // and add it to the list of words
            if (!node) {
                this.indexWord(cleanWord);
                node = new WordNode(cleanWord);
                this.words.set(cleanWord, node);
            }

            // Add the bookmark to the list of matches for the given word
            node.matches.set(lowerTitle, bookmark);
        }
    }
    
    private cleanWord(word: string) {
        let cleanWord = word.toLowerCase();
        cleanWord = cleanWord.replace("'s", "").replace(",", "");
        return cleanWord;
    }

    /**
   * Index a single word by creating a path from the root
   */
    private indexWord(word) {
        let currentNode = this.root;

        // Create a path from the root to the end of the word
        for (const char of word) {
            const isIndexed = currentNode.children.has(char);
            if (!isIndexed) {
                currentNode.children.set(char, new CharNode(char));
                this.trieSize++;
            }
            currentNode = currentNode.children.get(char)!;
        }

        // Mark the currentNode as the end of the word
        currentNode.endOfWord = true;
    }

    findAllWords(query): string[] {

        const words: string[] = [];
        let charNode = this.root;

        // While the charNode has children, keep traversing
        // If the node has no children, the prefix is not in the trie
        let currentQuery = "";
        for (const char of query.toLowerCase()) {
            if (charNode.children.has(char)) {
                charNode = charNode.children.get(char)!;
                currentQuery += char;
            } else {
                return words;
            }
        }

        // Find all words in the trie that start with the prefix
        // by looping over the children of the charNode
        this.getWordsFromPrefix(charNode, currentQuery, words);
        return words;
    }

    /**
     * Retrieves all indexed words that contain the given query (prefix)
     */
    private getWordsFromPrefix(charNode, currentQuery, words) {
        // If current node is the end of a word, add it to the list of words
        if (charNode.endOfWord) words.push(currentQuery);

        // Add subprefixes of the current node to the list of words
        for (const [_, child] of charNode.children) {
            this.getWordsFromPrefix(child, currentQuery + child.key, words);
        }
    }

    /**
     * Find all indexed bookmarks whose title contains the given query
     * @param query User query
     * @returns An array of matching BookmarkItem
     */
    public findBookmarksFromWord(query: string) {
        const indexedResults: BookmarkItem[] = []
        var indexedBookmarks = this.words.get(query);
        if (!indexedBookmarks) return indexedResults;

        for (const result of indexedBookmarks?.matches.values()) {
            indexedResults.push(result);
        }
        
        return indexedResults;
    }
}


export default SearchTrie;