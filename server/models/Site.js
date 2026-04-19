const mongoose = require('mongoose');

const TourLinkSchema = new mongoose.Schema({
  url: { type: String },

  type: {
    type: String,
    enum: [
      'maps',
      'arts',
      'youtube',
      'external',
      'unknown'
    ],
    default: 'unknown'
  },

  label: { type: String },

  /* NEW BOOLEAN */

  isIframe: {
    type: Boolean,
    default: true
  }

});
TourLinkSchema.pre("save", function (next) {

  if (
    this.url &&
    this.url.startsWith(
      "https://www.tamilnadutourism.tn.gov.in"
    )
  ) {
    this.isIframe = false;
  }

  next();

});

const HotspotSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const SiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  also_known_as: [String],
  location: {
    city: String,
    state: String,
    country: String,
    lat: Number,
    lng: Number,
  },
  category: String,
  dynasty_or_period: String,
  year_built: String,
  built_by: String,
  architectural_style: String,
  historical_background: String,
  cultural_significance: String,
  architectural_highlights: [String],
  legends_and_stories: String,
  virtual_tour_links: [TourLinkSchema],
  virtual_tour_hotspots: [HotspotSchema],
  visitor_info: {
    timings: String,
    entry_fee: String,
    best_time_to_visit: String,
    how_to_reach: String,
    accessibility: String,
  },
  nearby_sites: [String],
  conservation_status: String,
  images: [String],
  data_source: {
    type: String,
    enum: ['database', 'ai_generated', 'mixed'],
    default: 'database',
  },
  history_full: String,
  architecture_full: String,
  culture_full: String,
  visitor_full: String,

}, { timestamps: true });

SiteSchema.index({
  name: 'text',
  also_known_as: 'text',
  'location.city': 'text',
  'location.state': 'text',
  category: 'text',
});

module.exports = mongoose.model('Site', SiteSchema);