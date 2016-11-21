FactoryGirl.define do
  factory :broker do
    confirmed_at Time.now
    sequence(:first_name) { |n| "Test Broker#{n}" }
    sequence(:email) { |n| "broker#{n}@example.com" }
    password "please123"
  end

  factory :broker_7level_tree, class: Broker do
    transient do
      current_level 0
    end
    confirmed_at Time.now
    first_name "Broker"
    last_name {  "level#{current_level}" }
    email { "brokerlevel#{current_level}@example.com" }
    password "please123"

    after(:create) {|object|
      if object.depth< 7
        create :broker_7level_tree, parent: object, current_level: object.depth+1
      end
    }
  end
end
