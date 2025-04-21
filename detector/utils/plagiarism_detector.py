import nltk
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Download necessary NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')


class PlagiarismDetector:
    """Class for detecting plagiarism in text documents"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
    
    def preprocess_text(self, text):
        """Preprocess text for plagiarism detection"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and extra whitespace
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def get_sentences(self, text):
        """Split text into sentences"""
        return nltk.sent_tokenize(text)
    
    def calculate_similarity(self, text1, text2):
        """Calculate cosine similarity between two texts"""
        # Preprocess texts
        text1 = self.preprocess_text(text1)
        text2 = self.preprocess_text(text2)
        
        # Create TF-IDF matrix
        tfidf_matrix = self.vectorizer.fit_transform([text1, text2])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        return similarity * 100  # Convert to percentage
    
    def find_matching_sentences(self, text1, text2, threshold=0.8):
        """Find matching sentences between two texts"""
        sentences1 = self.get_sentences(text1)
        sentences2 = self.get_sentences(text2)
        
        matches = []
        
        for i, sent1 in enumerate(sentences1):
            for j, sent2 in enumerate(sentences2):
                if len(sent1) < 20 or len(sent2) < 20:  # Skip very short sentences
                    continue
                
                similarity = self.calculate_similarity(sent1, sent2)
                
                if similarity >= threshold * 100:
                    matches.append({
                        'text1_sentence': sent1,
                        'text2_sentence': sent2,
                        'similarity': similarity
                    })
        
        return matches
    
    def fingerprint_text(self, text, k=5):
        """Create a fingerprint of the text using k-grams"""
        text = self.preprocess_text(text)
        words = text.split()
        
        # Generate k-grams
        k_grams = []
        for i in range(len(words) - k + 1):
            k_grams.append(' '.join(words[i:i+k]))
        
        return k_grams
    
    def compare_fingerprints(self, fingerprint1, fingerprint2):
        """Compare two fingerprints and calculate similarity"""
        set1 = set(fingerprint1)
        set2 = set(fingerprint2)
        
        # Calculate Jaccard similarity
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        if union == 0:
            return 0
        
        return (intersection / union) * 100
    
    def detect_plagiarism(self, text, reference_texts):
        """
        Detect plagiarism by comparing text with reference texts
        
        Args:
            text (str): The text to check for plagiarism
            reference_texts (list): List of (text, source_info) tuples to compare against
            
        Returns:
            dict: Plagiarism detection results
        """
        overall_score = 0
        matches = []
        
        # Create fingerprint of the text
        text_fingerprint = self.fingerprint_text(text)
        
        for ref_text, source_info in reference_texts:
            # Calculate overall similarity
            similarity = self.calculate_similarity(text, ref_text)
            
            # Find matching sentences
            sentence_matches = self.find_matching_sentences(text, ref_text)
            
            # Calculate fingerprint similarity
            ref_fingerprint = self.fingerprint_text(ref_text)
            fingerprint_similarity = self.compare_fingerprints(text_fingerprint, ref_fingerprint)
            
            # Combine different similarity measures
            combined_similarity = (similarity + fingerprint_similarity) / 2
            
            if combined_similarity > 20:  # Only include significant matches
                matches.append({
                    'source_info': source_info,
                    'similarity_score': combined_similarity,
                    'sentence_matches': sentence_matches
                })
        
        # Calculate overall plagiarism score
        if matches:
            # Weight by the length of the reference texts
            overall_score = sum(match['similarity_score'] for match in matches) / len(matches)
        
        return {
            'overall_score': overall_score,
            'matches': matches
        }
