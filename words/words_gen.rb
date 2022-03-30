#!/usr/bin/env ruby

require "json"

words = {}
File.readlines("words.txt").each do |word|
  first, last = word.split
  words[first] = Array(words[first]) + [last]
end

words_start = words.sort_by { -_2.size } .first(100).to_h.keys

File.write("words.js", "const words = #{words.to_json};")
File.write("words_start.js", "const words_start = #{words_start};")
