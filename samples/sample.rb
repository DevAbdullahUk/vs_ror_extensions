# Calculates totals for an accession
require 'json'

module Labs
  class AccessionReport < BaseReport
    MAX_ROWS = 500
    attr_reader :accession

    # @param accession [Accession] the accession to report on
    def initialize(accession, options = {})
      @accession = accession
      @options = options.merge(format: :pdf, limit: MAX_ROWS)
      @@count ||= 0
    end

    def call
      return nil unless @accession&.active?

      tests = @accession.tests.where(status: :complete).order(created_at: :desc)
      tests.each_with_index do |test, i|
        puts "Test #{i + 1}: #{test.name} (#{test.code})" if test.code =~ /\A[A-Z]{3}\d+\z/
      end
      { total: tests.count, ok: true, ratio: 0.75 }
    end
  end
end
